import Axios from "axios";
import { NextFunction, Request, Response, Router } from "express";
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import util from 'util';

import { Judge0URL } from "../../../config";
import { allowAdmin } from "../../_middleware/authorize";
import { Contest, UserContest } from "../models/contest.model";
import { Problem, ProblemIO, Submissions, UserProblems } from "../models/problem.model";
import { User } from "../models/user.model";
import * as problemService from '../services/problem.service';
const router = Router()

const renameAsync = util.promisify(fs.rename);

// Set up storage for multer to upload files to a tmp directory
const tmpStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'tmp/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}`);
    },
});

const upload = multer({ storage: tmpStorage });

router.get('/user/submission', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Seperate admin and user 
        const userId = req.query.userId;
        const submissionId = req.query.submissionId;
        const problemId = req.query.problemId;
        if (submissionId) {
            const s = await Submissions.findOne({ attributes: ['code'], where: { id: submissionId } });
            console.log(s);
            if (!s) throw 'ask dev to do something'
            return res.json(s.code)
        }

        if (!userId || !problemId) throw 'NAPG'
        const up = await UserProblems.findOne({ where: { UserId: userId, ProblemId: problemId } })
        if (!up) throw 'ask dev to do something'
        const s = await Submissions.findOne({ attributes: ['code'], where: { id: up.accsubid } });
        console.log(s);
        if (!s) throw 'ask dev to do something'
        res.json(s.code)
    } catch (e) {
        next(e)
    }
})


router.post('/addIO/:problemid', upload.fields([{ name: 'input' }, { name: 'output' }]), async (req: any, res: Response, next: NextFunction) => {
    const problemid = parseInt(req.params.problemid)
    const score = parseInt(req.body.score)
    const desiredLocation = `io/${problemid}/`;
    try {
        if (isNaN(problemid))
            throw "Invalid problem id"
        if (isNaN(score))
            throw "Score not provided"

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        // Ensure the desired location exists
        if (!fs.existsSync(path.join(__dirname, '../../../data', desiredLocation))) {
            fs.mkdirSync(path.join(__dirname, '../../../data', desiredLocation), { recursive: true });
        }

        const { ipath, opath } = await problemService.addIO(problemid, desiredLocation, score);

        await renameAsync(files['input'][0].path, path.join(__dirname, '../../../data', ipath));
        await renameAsync(files['output'][0].path, path.join(__dirname, '../../../data', opath));

        res.json({ message: "TestCase added successfully" });
    } catch (e) {
        console.error(e)
        next(e);
    }
})

const encodeBase64 = (data: string): string => {
    return btoa(data);
};



// Function to submit data to Judge0
const submitToJudge0 = async (sourceCode: string, languageId: number, stdin?: string, expected_output?: string, cpu_time_limit: number | null = null, memory_limit: number | null = null) => {
    const encodedSourceCode = encodeBase64(sourceCode);
    const encodedStdin = stdin ? encodeBase64(stdin) : null;
    const encodedExpectedOutput = expected_output ? encodeBase64(expected_output) : null;

    const submissionData: any = {
        source_code: encodedSourceCode,
        language_id: languageId,
        base64_encoded: true,
        stdin: encodedStdin,
        expected_output: encodedExpectedOutput,
        cpu_time_limit,
        memory_limit,
    };
    try {
        const response = await Axios.post(Judge0URL + '&wait=true&base64_encoded=true', submissionData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error: any) {
        console.log(error)
        throw "Cann't evaluate the code right now.";
    }
};

const runProgram = async (source_code: string, language_id: number, stdin?: string, expected_output?: string, cpu_time_limit?: number, memory_limit?: number) => {

    const data = await submitToJudge0(source_code, language_id, stdin, expected_output, cpu_time_limit, memory_limit);
    // console.log(typeof data.compile_output)//, Buffer.from(data.compiler_output, 'base64').toString('utf-8'))
    // deleting from judge0 db IDK, is it required ... 
    // and should we have to wait  for it to delete..?
    const r = await Axios.delete(`http://localhost:2358/submissions/${data.token}?ASDF=IAmVignesh&wait=true`)
    // if(data.compile_output != null) data.compile_output = ;
    return data;
}
const lids = {
    c: 50,
    "c#": 51,
    cpp: 54,
    go: 60,
    java: 62,
    python: 71,
    javascript: 63,
    rust: 73,
    typeScript: 74,
} as any;

router.post('/run/testcase', async (req: any, res: Response, next: NextFunction) => {
    try {

        if (!req.body.code)
            throw "No code provided"

        const language_id: number = lids[req.body.lid] as number
        if (!language_id)
            throw 'No valid language provided'

        const tc = await ProblemIO.findByPk(req.body.tcid)
        if (!tc)
            throw 'No valid language provided'

        let inp = fs.readFileSync(path.join('data', tc.input)), out = fs.readFileSync(path.join('data', tc.output));

        res.json(await runProgram(req.body.code, language_id, inp.toString(), out.toString()));

        // res.json({ output: Buffer.from(data.compile_output || data.stderr || data.stdout || '', 'base64').toString('utf-8'), verdect: data.status.description === "Accepted" && req.body.custominp ? "Result" : data.status.description });
    } catch (e) {
        console.log(e)
        next(e);
    }
});

router.post('/run/:problemid', async (req: any, res: Response, next: NextFunction) => {
    const problemid = parseInt(req.params.problemid)
    try {
        if (isNaN(problemid))
            throw "Invalid problem id"

        if (!req.body.code)
            throw "No code provided"

        const language_id: number = lids[req.body.lid] as number

        if (!language_id)
            throw 'No valid language provided'

        let inp: string | undefined, out: string | undefined;
        if (req.body.custominp)
            inp = req.body.input, out = req.body.expected_output;
        else {
            const rs = await Problem.findByPk(problemid, { attributes: ['input', 'output'] })
            if (!rs) throw 'Invalid ProblemId provided'
            inp = rs.input
            out = rs.output
        }
        const data = await runProgram(req.body.code, language_id, inp, out);

        res.json({ output: Buffer.from(data.compile_output || data.stderr || data.stdout || '', 'base64').toString('utf-8'), verdect: data.status.description === "Accepted" && req.body.custominp ? "Result" : data.status.description });
    } catch (e) {
        console.log(e)
        next(e);
    }
});


router.get('/statercode/:id', async (req: any, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)
    console.log('id:', id)
    try {
        if (isNaN(id))
            throw "Invalid problem id"
        let problem = (await Problem.findByPk(id))?.getStaterCode();
        console.log(await problem)
        res.json(await problem);
    } catch (error) {
        console.error("in problem controller")
        next(error)
    }
});

router.get('/ts/:id', async (req: any, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)
    try {
        if (isNaN(id))
            throw "Invalid problem id"
        const p = await problemService.getById(id);

        res.json(await p.getProblemIOs());
    } catch (error) {
        console.error("in problem controller")
        next(error)
    }
})

router.post('/edit/:id', async (req: any, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)
    try {
        if (isNaN(id))
            throw "Invalid problem id"
        if (req.body.title === undefined || req.body.q === undefined)
            throw 'Not all params given';
        await problemService.edit(id, req.body)
        res.json({ message: 'Edited Successfully' });
    } catch (error) {
        console.error("in problem controller")
        next(error)
    }
})

router.get('/submissions/:id', async (req: any, res: Response, next: NextFunction) => {
    const problemid = parseInt(req.params.id)
    try {
        if (isNaN(problemid))
            throw "Invalid problem id"
        let up = await UserProblems.findOne({ where: { UserId: req.user.id, ProblemId: problemid } });

        res.json((await up?.getSubmissions({ attributes: ['id', 'verdect', 'score', 'createdAt'] })));
    } catch (error) {
        console.error("in problem controller")
        next(error)
    }
});

// TODO: rate limiting

router.post('/submission/:problemid', async (req: any, res: Response, next: NextFunction) => {
    const problemid = parseInt(req.params.problemid)
    try {
        if (isNaN(problemid))
            throw "Invalid problem id"

        if (req.body.lid == undefined)
            throw 'Language ID not provided'
        const language_id: number = lids[req.body.lid] as number
        if (!language_id)
            throw 'No valid language provided'

        const user = await User.findByPk(req.user.id) as any;
        const problem = await Problem.findByPk(problemid);
        if (!problem) throw 'No problem with given id'
        const c = await problem.getContest();
        if (c.state != 'active' && c.state != 'manualactive') throw 'Problem contest is not active';

        let up = await UserProblems.findOne({ where: { UserId: user.id, ProblemId: problemid } });
        if (up == null) {
            await user.addProblem(problemid, { through: { score: 0 } });
            up = await UserProblems.findOne({ where: { UserId: user.id, ProblemId: problemid } });
        }
        if (!up) throw Error("in submissions cann't create userproblem")

        // get all the IOs aka TestCases
        const ios = await problem.getProblemIOs()
        let currentSubmissionScore = 0, maxScore = 0;
        const tcs: { verdect: string, score: number, maxScore: number }[] = []

        // run all Test Cases and compute the score 
        for (const io of ios) {
            const inp = fs.readFileSync(path.join('data', io.input)), out = fs.readFileSync(path.join('data', io.output));
            maxScore += io.score;
            const data = await runProgram(req.body.code, language_id, inp.toString(), out.toString());
            if (data && (typeof data.status != typeof 401) && data.status.description) {

                tcs.push({ verdect: data.status.description, score: (data.status.description === 'Accepted' ? io.score : 0), maxScore: io.score })
                if (data.status.description === 'Accepted') {
                    currentSubmissionScore += io.score;
                }
            } else throw data
        }

        // should the TLE, MLE be Wrong Answers..?
        const submission = await up.createSubmission({
            code: req.body.code,
            verdect: currentSubmissionScore == maxScore ? "Accepted" : "Wrong Answer",
            score: currentSubmissionScore, lang: req.body.lid
        });

        if (up.score <= currentSubmissionScore) {
            // updating the UserProblem table
            user.addProblem(problemid, { through: { score: currentSubmissionScore, accsubid: submission.id } });

            console.log("UP score: ", up.score,)
            if (up.score != currentSubmissionScore) {

                // updating in UserContest table
                let uc = await UserContest.findOne({ where: { UserId: user.id, ContestId: c.id } })
                if (uc == null) { // This will be ran in worst case (it means the user has not registred before)
                    user.addContest(c.id);
                    uc = await UserContest.findOne({ where: { UserId: user.id, ProblemId: problemid } });
                }
                if (!uc) throw Error("in submissions cann't create usercontest")
                if (uc.end) throw 'You ended the contest or the contest has ended'
                user.addContest(c, { through: { score: uc.score + currentSubmissionScore - up.score } })
            }
        }

        res.json({ verdect: submission.verdect, tcs, score: submission.score, id: submission.id });
    } catch (error) {
        console.error("[ERROR] in problem controller")
        next(error)
    }
});

/*
gets the /?contestId
req.pa
res.body = {
    id: number;
    title: string;
    maxScore: number;
    tried: number;
    attempted: boolean;
    solved: boolean;
}
*/
router.get('/', async (req: any, res: Response, next: NextFunction) => {
    try {
        if (req.query.contestId) {
            // TODO: validate contetst id type
            // console.log(parseInt(req.query.contestId as string))
            const userId = req.user ? req.user.id : undefined
            res.json(await problemService.getAllFromContestForUser(parseInt(req.query.contestId as string), userId))
        } else {
            res.json(await problemService.getAll());
        }
    } catch (error) {
        next(error)
    }
})

router.get('/:id', async (req: any, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)
    try {
        if (isNaN(id))
            throw "Invalid problem id"
        let problem = await problemService.getById(id);
        res.json(problem);
    } catch (error) {
        console.error("in problem controller")
        next(error)
    }
});
/*
create's problem and adds it to the contest id provided.

req.body = {
title: string, 
contestId: number, 
q: string
}
*/
router.post('/create', allowAdmin(), async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(JSON.stringify(req.body))
        if (req.body.title === undefined || req.body.contestId == undefined || req.body.q === undefined ||
            req.body.input == undefined || req.body.output == undefined)
            throw 'Not all params given';

        console.log("\n\nHi\n\n")
        res.json(await problemService.create(req.body))
    } catch (error) {
        console.log("\n\eooro\n\n", error)
        next(error)
    }
});

router.delete('/:id', allowAdmin(), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await problemService._delete(parseInt(req.params.id));
        res.json({ message: 'Problem deleted successfully' });
    } catch (error) {
        next(error);
    }
})

router.get('/all/submissions/', async (req: Request, res: Response, next: NextFunction) => {
    const contestId = parseInt(req.query.contestId as string), userId = parseInt(req.query.userId as string);
    try {
        if (isNaN(contestId) && isNaN(userId))
            throw "Invalid problem id"
        const contest = await Contest.findByPk(contestId);
        if (!contest) throw 'Invalid contest ID'
        const uc = await UserContest.findOne({ where: { UserId: userId, ContestId: contestId } })
        let resData = { contestState: contest.state }
        if (!uc) return res.json({ contestState: contest.state, problems: [], userState: -1 });
        const problems = await contest.getProblems();
        if (!problems) throw 'Error getting problem'
        res.json({
            contestState: contest.state,
            userState: uc.end ? 1 : 0,
            problems: await Promise.all(
                problems.map(
                    async (p, index) => {
                        const up = await UserProblems.findOne({ where: { ProblemId: p.id, UserId: userId } });

                        return ({ id: p.id, title: p.title, submissions: await up?.getSubmissions({ attributes: ['id', 'verdect', 'score', 'createdAt'] }) })
                    }
                )
            )
        })
        // res.json(await problem.getProblemIOs());
    } catch (error) {
        console.error("in problem controller")
        next(error)
    }
})

router.get('/io/:id', async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id)
    try {
        if (isNaN(id))
            throw "Invalid problem id"
        let problem = await problemService.getById(id);
        res.json(await problem.getProblemIOs());
    } catch (error) {
        console.error("in problem controller")
        next(error)
    }
})

export default router;
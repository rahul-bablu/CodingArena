import path from "path";
import { Contest } from "../models/contest.model";
import { Problem, ProblemIO, UserProblems } from "../models/problem.model"
import { User } from "../models/user.model";
import { title } from "process";

export const getAll = async () => {
    return await Problem.findAll({ attributes: ['id', 'title'] });
}

export const addIO = async (id: number, desiredLocation:string, score: number) => {
    const pio = await ProblemIO.create({ score, input:'initing...', output: 'initing...'})
    const p = (await Problem.findByPk(id))!;
    await p?.addProblemIO(pio);
    const ios = await p?.getProblemIOs()!;
    let maxScore = 0;
    for (const io of ios) { // TODO: change to reduce
        maxScore += io.score;
    }
    p.maxscore = maxScore;
    await p.save();
    pio.input = path.join(desiredLocation, `input-${pio.id}.txt`);
    pio.output = path.join(desiredLocation, `output-${pio.id}.txt`);
    await pio.save();
    return { ipath:pio.input , opath:pio.output };
}

export const getAllFromContest = async (id: number) => {

    let contest = await Contest.findByPk(id);
    if (!contest) throw "Invalid contest id provided";
    return await contest.getProblems({ attributes: ['id', 'title', 'maxscore'] });
}

export const getAllFromContestForUser = async (id:number, userId?: string) => {
    const problems = await getAllFromContest(id);
    return await Promise.all(problems.map(async (p, index) => {
        console.log(p.maxscore);
        // TODO: Compute solved flag
        return { id: p.id, title: p.title, maxScore: p.maxscore, tried: await p.countUsers(), attempted: (userId ? await p.hasUser(parseInt(userId as string)): false), solved: false }
    }))
}

export const getAllFromContestIncludeIO = async (id: number) => {

    let contest = await Contest.findByPk(id);
    if (!contest) throw "Invalid contest id provided";
    return await contest.getProblems({ attributes: ['id', 'title', 'maxscore'] , include: ProblemIO});
}

export const getById = async (id: number) => {
    return await getProblem(id);
}

async function getProblem(id: number) {
    const problem = await Problem.findByPk(id);
    if (!problem) throw 'Invalid problem id provided';
    return problem;
}

export const create = async (params: { title: string, contestId: number, q: string, input: string, output: string }) => {
    if (await Problem.findOne({ where: { title: params.title } }))
        throw 'Problem with same problem exist'

    const contest = await Contest.findByPk(params.contestId);
    if (!contest) throw 'Invalid contest id provided'

    await contest.addProblem(await Problem.create(params));
    return { message: "Problem created successfully" }

}

export const edit = async (problmeId: number, params: { title: string, q: string }) => {
    const p = await Problem.findByPk(problmeId);

    if(!p) throw 'Invalid problem id'

    p.title = params.title;
    p.q = params.q;
    await p.save();
}

export const _delete = async (id: number) => {
    const problem = await getProblem(id);
    await problem.destroy();
}


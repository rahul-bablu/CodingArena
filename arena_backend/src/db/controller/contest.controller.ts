import { NextFunction, Request, Response, Router } from "express";
import { col, fn } from "sequelize";
import { allowAdmin } from "../../_middleware/authorize";
import { Contest, UserContest } from "../models/contest.model";
import { Problem } from "../models/problem.model";
import { User } from "../models/user.model";
import * as contestService from '../services/contest.service';
import * as problemService from '../services/problem.service';
const router = Router()

router.post('/create', allowAdmin(), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.title === undefined || req.body.state === undefined || req.body.startTime === undefined || req.body.endTime === undefined)
            throw 'NAPG'

        res.json(await contestService.create(req.body))
    } catch (error) {
        next(error)
    }
})

router.get('/leaderbord/:id', async (req: Request, res: Response, next: NextFunction) => {
    const contestId = parseInt(req.params.id);
    try {
        const leaderboard = await User.findAll({
            attributes: [
                'id',
                'username',
                  [fn('SUM', col('Problems->UserProblems.score')), 'totalScore'],
                //   'Problems->UserProblems.updatedAt'
            ],
            include: [{
                model: Problem,
                attributes: ['id', 'title'],
                // through: {
                //   attributes: ['score']
                // },
                where: { contestId: contestId }
            }],
            group: ['User.id', 'Problems.id'],
            // order: [[literal('totalScore'), 'DESC']]
        });
        const unsort = (await Promise.all(
            leaderboard.map(async (v:any) => {const uc = await UserContest.findOne({where:{UserId:v.id, ContestId:contestId}});return {id:v.id, username:v.username, totalScore:uc?.score, Problems:v.Problems}})
        ))
        unsort.sort((a:any,b:any)=> {return a.totalScore < b.totalScore?1:a.totalScore > b.totalScore?-1:0})
        res.json(
            unsort
        
        )
    } catch (error) {
        console.log(error)
    next(error)
}
})

router.get('/problems', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.query.contestId) {
            // TODO: validate contetst id type
            const c = await contestService.getContest(parseInt(req.query.contestId as string))
            res.json({ id: c.id, title: c.title, problems: await problemService.getAllFromContest(c.id) })
        } else {
            throw "No contest id provided"
        }
    } catch (error) {
        next(error)
    }
})


router.get('/admin/problems', allowAdmin(), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.query.contestId) {
            // TODO: validate contetst id type
            const c = await contestService.getContest(parseInt(req.query.contestId as string))
            res.json({ id: c.id, title: c.title, state: c.state, problems: await problemService.getAllFromContestIncludeIO(c.id) })
        } else {
            throw "No contest id provided"
        }
    } catch (error) {
        next(error)
    }
})

router.get('/', allowAdmin(), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.query.contestId) {
            // TODO: validate contetst id type
            res.json(await contestService.getContest(parseInt(req.query.contestId as string)))
        } else
            res.json(await contestService.getAll());

    } catch (error) {
        next(error)
    }
})

router.get('/allusers', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.query.contestId) {
            // TODO: validate contetst id type
            const contest = await contestService.getContest(parseInt(req.query.contestId as string))
            if (contest == null) throw "Invaild contest ID provided"
            res.json(await contest.getUsers())
        } else
            throw 'NAPG'

    } catch (error) {
        next(error)
    }
})

/**
 * req.params: {
 *  id               -- Contest ID
 * }
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await contestService._delete(parseInt(req.params.id));
        res.json({ message: 'Contest deletes successfully' });
    } catch (error) {
        next(error);
    }
})

/**
 * req.params: {
 *  id              -- Contest ID
 * }
 * req.body: {
 *  userId
 * }
 */

router.post('/adduser', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("\n\n\HI", req.body)
        const c = await Contest.findByPk(parseInt(req.body.contestId));
        if (!c) throw "Invalid Contest ID"
        await c.addUser(req.body.userId)
        console.log(await c.getUsers())
        // if (uc == null) throw 'Could not register'
        res.json({ message: 'Successfully registred' });
    } catch (error) {
        next(error);
    }
})

router.get('/problems/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.query.contestId) {
            // TODO: error check
            const userId = (req as any).user.id; // it has because of authorize middleware
            // TODO: validate contetst id type
            const c = await contestService.getContest(parseInt(req.query.contestId as string))
            const uc = await UserContest.findOne({ where: { ContestId: c.id, UserId: userId } });
            if (!uc) return "User have to be registred"
            if (uc.end == true) return "User has already ended the contest"
            if (c.state == 'end') return res.send({ error: 'Contest has ended' })
            if (c.state == 'manual')
                return res.send({ error: 'Contest is not active' })
            if (c.state == 'inactive') {
                if (c.startTime > new Date()) {

                    return res.send({ error: 'Contest has not started yet' })
                }
                c.state = 'active'
                await c.save()
            }
            else if (c.state == 'active') {
                if (c.endTime < new Date()) {
                    c.state = 'end'
                    await c.save()
                    return res.send('Contest has ended')
                }
            }



            res.json({
                id: c.id, title: c.title, state: c.state, startTime: c.startTime, endTime: c.endTime, problems: await problemService.getAllFromContestForUser(c.id, userId)
            })
        } else {
            throw "No contest id provided"
        }
    } catch (error) {
        next(error)
    }
})

router.post('/endcontest', allowAdmin(), async (req: any, res: Response, next: NextFunction) => {

    try {
        const c = await Contest.findByPk(parseInt(req.body.contestId));
        if (!c) throw "Invalid Contest ID"
        c.state = 'end';
        await c.save();

        res.json(
            "Contest has ended"
        );
    } catch (error) {
        next(error)
    }
})
/* 
query: { 
    userId: number,

}
*/

router.get('/all', allowAdmin(), async (req: any, res: Response, next: NextFunction) => {

    try {
        // TODO: error check
        const { id: userId } = req.user as User;
        // const contests = await Contest.findAll({ where:  {state: {[Op.in]:['active', 'manualactive', 'inactive',]} ,}, });
        const contests = await Contest.findAll();
        res.json(
            contests
        );
    } catch (error) {
        next(error)
    }
})


router.get('/user', async (req: any, res: Response, next: NextFunction) => {
    try {
        // TODO: error check
        const { id: userId } = req.user as User;
        // const contests = await Contest.findAll({ where:  {state: {[Op.in]:['active', 'manualactive', 'inactive',]} ,}, });
        const contests = await Contest.findAll();
        res.json(
            (await Promise.all(
                contests.map(
                    async (c, index) => {
                        const uc = await UserContest.findOne({ where: { ContestId: c.id, UserId: userId } });
                        if (uc == null && c.state == 'end') return null;
                        return ({ id: c.id, title: c.title, registred: uc != null, state: c.state, startTime: c.startTime, endTime: c.endTime, uended: (uc && uc.end) || false })
                    }
                )
            )).filter(item => item !== null)
        );
    } catch (error) {
        next(error)
    }
})

export default router;
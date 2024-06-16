import { Router, Request, Response, NextFunction } from "express";
import * as contestService from '../services/contest.service';
import { Contest } from "../models/contest.model";
import * as problemService from '../services/problem.service';
import { Op, col, fn, literal } from "sequelize";
import { User } from "../models/user.model";
import { Problem } from "../models/problem.model";
import { allowAdmin } from "../../_middleware/authorize";
const router = Router()

router.post('/create', async (req: Request, res: Response, next: NextFunction) => {
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
              'Problems->UserProblems.updatedAt'
            ],
            include: [{
                model: Problem,
                attributes: ['id', 'title'],
                through: {
                  attributes: ['score']
                },
                where: { contestId: contestId }
            }],
            group: ['User.id', 'Problems.id'],
            order: [[literal('totalScore'), 'DESC']]
          });
        res.json(leaderboard)
    } catch (error) {
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
            res.json({ id: c.id, title: c.title, problems: await problemService.getAllFromContestIncludeIO(c.id) })
        } else {
            throw "No contest id provided"
        }
    } catch (error) {
        next(error)
    }
})

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
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

router.post('/adduser/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const c = await Contest.findByPk(parseInt(req.params.id));
        if (!c) throw "Invalid Contest ID"
        await c.addUser(req.body.userId)
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
                id: c.id, title: c.title, problems: await problemService.getAllFromContestForUser(c.id, userId)
            })
        } else {
            throw "No contest id provided"
        }
    } catch (error) {
        next(error)
    }
})
/* 
query: { 
    userId: number,

}
*/

router.get('/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: error check
        const { userId } = req.query;
        const contests = await Contest.findAll({ where:  {state: {[Op.in]:['active', 'manualactive', 'inactive']} ,}, });

        res.json(
            await Promise.all(
                contests.map(
                    async (c, index) =>
                        ({ id: c.id, title: c.title, registred: await c.hasUser(parseInt(userId as string)), state: c.state, startTime: c.startTime, endTime: c.endTime })
                )
            )
        );
    } catch (error) {
        next(error)
    }
})

export default router;
import { NextFunction, Request, Response, Router } from "express";
import { authorize } from "../../_middleware/authorize";
import { UserContest } from "../models/contest.model";
import { Problem, Submissions, UserProblems } from "../models/problem.model";
import { User } from "../models/user.model";
import * as userService from '../services/user.service';

const router = Router()

router.post('/authenticate', function authenticate(req: Request, res: Response, next: NextFunction) {
    userService.authenticate(req.body)
        .then((user: User) => res.json(user))
        .catch(next);
})

router.get('/whoami', authorize(), async function whoami(req: any, res: Response, next: NextFunction):Promise<void> {
    try {
        const user = req.user as User; // sent in authorization
        res.json({ username: user.username, id: user.id });
    } catch (error) {
        next(error);
    }
})

router.post('/register', async function register(req: Request, res: Response, next: NextFunction) {
    try {
        await userService.create(req.body);
        res.json({ message: 'Registration successful' });
    } catch (error) {
        next(error);
    }
})


// TODO: add authi to remove
router.delete('/delete', async function _delete(req: Request, res: Response, next: NextFunction) {
    try {
        await userService._delete(parseInt(req.params.id));
        res.json({ message: 'User deleted successfully' })
    } catch (e) {
        next(e);
    }

})

router.get('/submissions', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let limit = 3;
        const userId = req.query.userId;
        if (!userId) throw 'NAPG'
        console.log("Hi")
        const up = await UserProblems.findAll({ where: { UserId: userId}, include: [{model: Submissions, attributes: ['code']}, {model: Problem, attributes: ["title"]}]})
        // if (!up) throw 'ask dev to do something'
        // const s = await Submissions.findAll({ where: { upid: up.id }, limit: limit, offset: (parseInt(req.query.page as string || "0")) * limit });
        console.log(up,"\n\n\n");
        if (!up) throw 'ask dev to do something'
        res.json(up)
    } catch (e) {
        console.log(e)
        next(e)
    }
})

router.post('/endcontest',authorize(), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        if (!userId) throw 'ADTDS'
        const contestId = req.body.contestId;
        if(!contestId) return 'NAPG'
        const c = await UserContest.findOne({where:{UserId: userId, ContestId: contestId}})
        if(!c) return "User has not registerd yet"
        c.end = true;
        await c.save()
        res.send("Contest has been submitted")
    } catch (e) {
        console.log(e)
        next(e)
    }
})

export default router;


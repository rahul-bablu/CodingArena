import { Router, Request, Response, NextFunction } from "express";
import { User } from "../models/user.model";
import * as userService from '../services/user.service'
import { authorize } from "../../_middleware/authorize";

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

export default router;


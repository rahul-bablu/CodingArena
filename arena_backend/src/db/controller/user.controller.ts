import bcrypt from 'bcryptjs';
import { randomBytes } from "crypto";
import { NextFunction, Request, Response, Router } from "express";
import { Op } from "sequelize";
import { authorize } from "../../_middleware/authorize";
import { sendEmail } from '../common';
import { UserContest } from "../models/contest.model";
import { Problem, Submissions, UserProblems } from "../models/problem.model";
import { User, VerifyToken } from "../models/user.model";
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
        res.json(user);
    } catch (error) {
        next(error);
    }
})

let encodeChars="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

function randomStr(length: number) {
    let rb = randomBytes(length);
    let r = "";
    for (let i = 0; i < rb.length; i++) {
        let j = rb[i] % encodeChars.length;
        r = r+encodeChars[j];
    }

    return(r);
}

let token = randomStr(10);
console.log(token);

router.post('/forgotpass', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findOne({where: {[Op.or]: [{username:req.body.username}, {email: req.body.email}]}})
        if(!user) return res.status(400).json({message: 'No user with such username or password exist'})
        const password = randomStr(10);
    sendEmail({to: `${user.email}`, subject: 'New Password for Coding Arena', message: `Your new password is: ${password}`})
        user.phash = await bcrypt.hash(password, 10);
        res.json({ message: 'New password has been sent to your registred email' });
    } catch (error) {
        next(error);
    }
})

router.get('/verify-email/:id/:token', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.params.token;
  
      //find user by token using the where clause
      const usertoken = await VerifyToken.findOne({
          where: {
            token,
          userId: req.params.id,
        },
      });
      console.log(usertoken);
  
      //if token doesnt exist, send status of 400
      if (!usertoken) {
        return res.status(400).send({
          msg: "Your verification link may have expired. Please click on resend for verify your Email.",
        });
  
        //if token exist, find the user with that token
      } else {
        const user = await User.findOne({ where: { id: req.params.id } });
        if (!user) {
          console.log(user);
  
          return res.status(401).send({
            msg: "We were unable to find a user for this verification. Please SignUp!",
          });
  
          //if user is already verified, tell the user to login
        } else if (user.isVerified) {
          return res
            .status(200)
            .send("User has been already verified. Please Login");
  
          //if user is not verified, change the verified to true by updating the field
        } else {
          const updated = await User.update(
            { isVerified: true },
            {
              where: {
                id: usertoken.userId,
              },
            }
          );
          console.log(updated);
  
          //if not updated send error message
          if (!updated) {
            return res
              .status(200)
              .send("Your account has been successfully verified");
          }
        }
      }
    } catch (error) {
        next(error);
    }
  })

router.post('/register', async function register(req: Request, res: Response, next: NextFunction) {
    try {
        await userService.create({username:req.body.username, password: req.body.password, phash:req.body.phash, email: req.body.email});
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

router.get('/all', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.findAll();
        // if (!up) throw 'ask dev to do something'
        // const s = await Submissions.findAll({ where: { upid: up.id }, limit: limit, offset: (parseInt(req.query.page as string || "0")) * limit });
        // console.log(up,"\n\n\n");
        if (!users) throw 'ask dev to do something'
        res.json(users)
    } catch (e) {
        console.log(e)
        next(e)
    }
})

export default router;


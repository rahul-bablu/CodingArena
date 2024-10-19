import { NextFunction, Request, Response, Router } from "express";
import { allowAdmin } from "../../_middleware/authorize";
import { Room } from "../assocations";
import { sequelize } from "../common";
import { Contest, UserContest } from "../models/contest.model";
import * as roomService from '../services/room.service';

const router = Router()
function make_code(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

router.post('/create', allowAdmin(), async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.name === undefined || req.body.open === undefined)
            throw 'NAPG'

        req.body.code = req.body.code || make_code(6)

        res.status(201).json(await roomService.create(req.body))
    } catch (error) {
        next(error)
    }
})

// GET USERS
router.get('/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.query.roomId) {
            // TODO: validate contetst id type
            const room = await roomService.getRoom(parseInt(req.query.roomId as string))
            if (room == null) throw "Invaild room ID provided"
            res.json(await room.getUsers())
        } else
            throw 'NAPG'

    } catch (error) {
        next(error)
    }
})

// router.get('/', allowAdmin(), async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         if (req.query.roomId) {
//             // TODO: validate contetst id type
//             res.json(await roomService.getRoom(parseInt(req.query.roomId as string)))
//         } else
//             res.json(await roomService.getAll());

//     } catch (error) {
//         next(error)
//     }
// })

// DELETE ROOM
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await roomService._delete(parseInt(req.params.id));
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        next(error);
    }
})

// ADD USERS
router.post('/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const c = await roomService.getRoomByName(req.body.roomName);
        const userId = (req as any).user.id; // it has because of authorize middleware

        if (c.code != req.body.roomCode) throw "Invalid room details"
        if (!c.open) "Room not found"
        if (!c) throw "Invalid Room ID"
        await c.addUser(userId)
        // if (uc == null) throw 'Could not register'
        res.json({ message: 'Successfully joined' });
    } catch (error) {
        next(error);
    }
})


// ADD CONTEST TO ROOM
router.post('/contest', allowAdmin(), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const c = await roomService.getRoom(parseInt(req.body.roomId));
        if (!c) throw "Invalid Room ID"
        await c.addContest(req.body.contestId)
        // if (uc == null) throw 'Could not register'
        res.json({ message: 'Successfully add contest to room' });
    } catch (error) {
        next(error);
    }
})

router.delete('/contest', allowAdmin(), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const c = await roomService.getRoom(parseInt(req.body.roomId));
        if (!c) throw "Invalid Room ID"
        await c.removeContest(req.body.contestId)
        // if (uc == null) throw 'Could not register'
        res.json({ message: 'Contest removed from room' });
    } catch (error) {
        next(error);
    }
})

router.delete('/user', allowAdmin(), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const c = await roomService.getRoom(parseInt(req.body.roomId));
        if (!c) throw "Invalid Room ID"
        await c.removeUser(req.body.userId)
        // if (uc == null) throw 'Could not register'
        res.json({ message: 'User removed from room' });
    } catch (error) {
        next(error);
    }
})


async function getLeaderboardByContest(contestId: number, title?: string) {
    const query = `
    SELECT 
      u.username, 
      SUM(up.score) AS totalScore,
      MAX(CASE WHEN s.score > 0 THEN s.createdAt END) AS latestSubmissionTime
    FROM 
      users u
    INNER JOIN 
      userproblems up ON u.id = up.userId
    INNER JOIN 
      problems p ON p.id = up.problemId
    INNER JOIN 
      contests c ON c.id = p.contestId
    INNER JOIN 
      submissions s ON up.id = s.upid
    WHERE 
      c.id = :contestId
      AND s.id = up.accsubid -- Only consider submissions where score did not decrease
    GROUP BY 
      u.id
    ORDER BY 
      totalScore DESC, latestSubmissionTime ASC;
    `
    try {
        // const contest = await Contest.findByPk(contestId, {attributes: ['title']});
        // if(!contest) throw 'Page not found'
        const [results] = await sequelize.query(query, {
            replacements: { contestId },
        });
        const result =  results.map((item:any)=>{return {...item, contestName: title}})
        return result;
    } catch (error) {
        console.error('Error fetching leaderboard with union:', error);
        throw error;
    }
}
router.get('/leaderboard/:id', async (req: Request, res: Response, next: NextFunction) => {
    const roomId = parseInt(req.params.id);
    try {
        const room = await roomService.getRoom(roomId);
        const contests = await room.getContests({attributes: ['id', 'title']});
        // console.log(contests)
        
        res.json(await Promise.all(
            contests.map(async ({id, title}) => {const ld = await getLeaderboardByContest(id, title); console.log("asdf -- ",ld);return ld})
        ))
    } catch (error) {
        console.log(error)
        next(error)
    }
})


// GET ROOM
router.get('/name/:roomName', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.roomName == undefined)
            throw "Page not found"
        const userId = (req as any).user.id; // it has because of authorize middleware
        // TODO: validate contetst id type
        const room = await roomService.getRoomByName(req.params.roomName, [{
            model: Contest,
            as: 'contests',
        },]) as Room & { contests: Contest[] };

        if (!(await room.hasUser(userId))) {
            throw 'Page not found'
        }
        // room.contests = (await Promise.all(
        //     room.contests.map(
        //         async (c: any, index:number) => {
        //             const uc = await UserContest.findOne({ where: { ContestId: c.id, UserId: userId } });
        //             if (uc == null && c.state == 'end') return null;
        //             return ({ id: c.id, title: c.title, registred: uc != null, state: c.state, startTime: c.startTime, endTime: c.endTime, uended: (uc && uc.end) || false })
        //         }
        //     )
        // )).filter(item => item !== null) as any
        // console.log(room)
        res.json({
            id: room.id, name: room.name, code: room.code,
            desc: room.desc,
            open: room.open,
            contests: (await Promise.all(
                room.contests.map(
                    async (c: any, index: number) => {
                        const uc = await UserContest.findOne({ where: { ContestId: c.id, UserId: userId } });
                        if (uc == null && c.state == 'end') return null;
                        return ({ id: c.id, title: c.title, registred: uc != null, state: c.state, startTime: c.startTime, endTime: c.endTime, uended: (uc && uc.end) || false })
                    }
                )
            )).filter(item => item !== null)
        })

    } catch (error) {
        next(error)
    }
})

// GET ROOM FOR ADMIN
router.get('/admin', allowAdmin(), async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("\n\n\nasdf\n\n\n")
        if (req.query.roomId != undefined) {
            // TODO: validate contetst id type

            res.json(await roomService.getRoom(parseInt(req.query.roomId as string)))
        } else if (req.query.roomName != undefined) {
            res.json(await roomService.getRoomByName(req.query.roomName as string))
        } else {
            console.log("\n\n\nho\n\n\n")
            res.json(await roomService.getAll());
        }

    } catch (error) {
        next(error)
    }
})

router.post('/closeroom', allowAdmin(), async (req: any, res: Response, next: NextFunction) => {

    try {
        const r = await roomService.getRoom(parseInt(req.body.roomId));
        if (!r) throw "Invalid Contest ID"
        r.open = false;
        await r.save();

        res.json(
            "Room has been closed"
        );
    } catch (error) {
        next(error)
    }
})

export default router;

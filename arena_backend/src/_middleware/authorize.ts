import { Response } from "express";
import { expressjwt } from "express-jwt";
import { secret } from "../../config";


export function authorize() {
    return [
        expressjwt({ secret, algorithms: ['HS256'] }),

        // TODO: // if possible change req type
        async (req:any, res:Response, next:any) => {
            // get user with id from token 'sub' (subject) property
            // which has been set while autherization
            console.log(req.url, req.auth.sub)
            const user = await db.User.findByPk(req.auth.sub);
            if(!user)
            console.log(user, req.auth.sub)
            // check user still exists
            if (!user)
                return res.status(401).json({ message: 'Unauthorized require any usere' });

            req.user = user.get();
            req.user
            next();
        }
    ];
}

export function allowAdmin() {
    return [
        async (req:any, res:Response, next:any) => {
            const user = req.user;
            console.log(user, !(user.role in [UserRole.ADMIN, UserRole.DEV]))
            if (!user || !([UserRole.ADMIN, UserRole.DEV].includes(user.role)))
                return res.status(401).json({ message: 'Unauthorized require admin auth' });
            next()
        }
    ]
}

// export function adminAuthorize() {
//     return [
//         expressjwt({ secret, algorithms: ['HS256'] }),

//         // TODO: // if possible change req type
//         async (req:any, res:Response, next:any) => {
//             // get user with id from token 'sub' (subject) property
//             // which has been set while autherization
//             const user = await db.User.findByPk(req.auth.sub);

//             // check user still exists
//             if (!user || !(user.role in [UserRole.ADMIN, UserRole.DEV]))
//                 return res.status(401).json({ message: 'Unauthorized' });

//             req.user = user.get();
//             req.user
//             next();
//         }
//     ];
// }

import db from "../db";
import { UserRole } from "../db/models/user.model";


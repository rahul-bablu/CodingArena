import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as config from "../../../config";
import { sendEmail } from '../common';
import { User, VerifyToken } from "../models/user.model";

export async function authenticate({ username, password }: {username:string, password:string}) {
    const user = await User.scope('withHash').findOne({ where: { username } });
    
    if (!user || !(await bcrypt.compare(password, user.phash)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id, username: user.username, role: user.role }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function getAll() {
    return await User.findAll();
}

async function getById(id:number) {
    return await getUser(id);
}

export async function create(params:{username?:string, password?:string, phash?:string, email?:string}) {
    // validate
    if (await User.findOne({ where: { username: params.username?.trim() } })) {
        throw 'Username "' + params.username + '" is already taken';
    }
    if (await User.findOne({ where: { email: params.email?.trim() } })) {
        throw 'Email "' + params.email + '" has already registred';
    }

    // hash password
    if (params.password) {
        params.phash = await bcrypt.hash(params.password, 10);
    }
    console.log(JSON.stringify(params, null, 2))

    // save user
    const user = await User.create(params);

    // if (user) {
    //     let setToken = await VerifyToken.create({
    //       userId: user.id,
    //       token: crypto.randomBytes(16).toString("hex"),
    //     });
  
    //     //if token is created, send the user a mail
    //     if (setToken) {
    //       //send email to the user
    //       //with the function coming from the mailing.js file
    //       //message containing the user id and the token to help verify their email
    //       sendEmail({
    //         to: `${params.email}`,
    //         subject: "Account Verification Link",
    //         message: `Hello, ${params.username}\n Please verify your email for Coding Arena by clicking this link:\n
    //               ${config.APP_URL}/users/verify-email/${user.id}/${setToken.token} `,
    //       });
  
    //       //if token is not created, send a status of 400
    //     } else {
    //       throw "token not created";
    //     }
  
    //   } else {
    //     return "Details are incorrect";
    //   }
}


export async function update({ id, username, role, email }: { id: number, username: string, role: string, email: string }) {
    
    const user = await getUser(id);
    if (!user) {
        throw 'Not valid user';
    }
    if (username === '' || role === '' || email === '') {
        throw 'Empty Fields!!';
    }
    // validate
    username = username.trim();
    email = email.trim();
    const usernameChanged = username && user.username !== username;
    const emailChanged = email && user.email !== email;
    if (usernameChanged && await User.findOne({ where: { username: username } })) {
        throw 'Username "' + username + '" is already taken';
    }
    if (emailChanged && await User.findOne({ where: { email: email } })) {
        throw 'Email "' + email + '" is already taken';
    }

    // // hash password if it was entered
    // if (params.password) {
    //     params.phash = await bcrypt.hash(params.password, 10);
    // }


    // copy params to user and save
    Object.assign(user, {username, role, email});
    await user.save();
}

export async function _delete(id:number) {
    const user = await getUser(id);
    await user.destroy();
}

async function getUser(id:number) {
    const user = await User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user:any ) {
    const { phash, ...userWithoutHash } = user;
    return userWithoutHash;
}
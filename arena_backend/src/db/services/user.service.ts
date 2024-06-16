import { User } from "../models/user.model";
import * as config from "../../../config";
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function authenticate({ username, password }: {username:string, password:string}) {
    const user = await User.scope('withHash').findOne({ where: { username } });
    
    if (!user || !(await bcrypt.compare(password, user.phash)))
        throw 'Username or password is incorrect';

    // authentication successful
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
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
    if (await User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.phash = await bcrypt.hash(params.password, 10);
    }

    // save user
    await User.create(params);
}

export async function update(id:number, params:{username?:string, password?:string, phash?:string}) {
    const user = await getUser(id);

    // validate
    const usernameChanged = params.username && user.username !== params.username;
    if (usernameChanged && await User.findOne({ where: { username: params.username } })) {
        throw 'Username "' + params.username + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.phash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
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
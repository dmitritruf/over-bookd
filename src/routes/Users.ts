import StatusCodes from 'http-status-codes';
import { Request, Response} from 'express';
import UserDao from '@daos/User/UserDao.mock';
import logger from "@shared/Logger";
import KcAdminClient from 'keycloak-admin';
import UserModel from "@entities/User";
import path from "path";
const multer = require('multer');


const userDao = new UserDao();
const { BAD_REQUEST, CREATED, OK, NOT_FOUND} = StatusCodes;

const kcAdminClient = new KcAdminClient();

/**
 * Add one user.
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export async function setUser(req: Request, res: Response) {
    const mUser = req.body;
    // create user in keycloak
    // @ts-ignore
    mUser.keycloakID = await createUserInKeycloak(mUser);

    await saveUser(mUser);
    res.status(CREATED).end();
}

export async function getUsers(req: Request, res: Response) {
    const users = await UserModel.find({});
    res.json(users);
}

async function saveUser(user: any){
    await UserModel.create(user);
}

// @ts-ignore
async function createUserInKeycloak({firstname, lastname, password} ){
    const URL = (process.env.AUTH_URL || 'http://localhost:8080/') +
        'auth/admin/realms/project_a/users'
    logger.info('creating new user ' + lastname)
    await kcAdminClient.auth({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD,
        grantType: 'password',
        clientId: 'admin-cli',
    });

    const res = await kcAdminClient.users.create({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        username: firstname.toLowerCase() + '.' + lastname.toLowerCase(),
        enabled: true,
        credentials:[{
            type: 'password',
            value: password,
            temporary: false,
        }],
        realm: 'project_a',
    })
    logger.info(`user ${lastname} registred in keycloak as ${res.id}`)
    return res.id
}

export async function getUserByKeycloakID(req: Request, res: Response) {
    const keycloakID = req.params.keycloakID;
    logger.info('getting info for ' + keycloakID);
    const mUser = await UserModel.findOne({keycloakID})
    res.json(mUser)
}

export async function updateUserByKeycloakID(req: Request, res: Response) {
    // TODO check user role
    const keycloakID = req.params.keycloakID;
    logger.info('updating info for ' + keycloakID);
    const mUser = await UserModel.findOneAndUpdate({keycloakID}, req.body);
    res.json(mUser)
}


export async function getAllUsersName(req: Request, res: Response) {
    // TODO check role
    let users= await UserModel.find({});
    res.json(users.map(user => user.firstname + '.' +  user.lastname));
}

export async function addNotificationByFullName(req: Request, res: Response) {
    let query = req.params;
    if(!query.firstname || ! query.lastname){
        res.sendStatus(BAD_REQUEST)
    } else {
        let user = await UserModel.findOne({firstname : query.firstname, lastname: query.lastname});
        if (user){
            if(user.notifications === undefined){
                user.notifications = [];
            }
            // @ts-ignore
            user.notifications.push(req.body)
            await UserModel.findByIdAndUpdate(user._id, {notifications: user.notifications})
            res.sendStatus(OK)
        } else {
            res.sendStatus(NOT_FOUND)
        }
    }


}

export async function broadcastNotification({body}: Request, res: Response) {
    // TODO check role
    const isHard = true
    logger.info(`broadcasting message...`)
    if(isHard){
        let users = await UserModel.find({});
        await Promise.all(users.map(async (user) => {
            let mUser = user.toObject();
            if (mUser.notifications === undefined) {
                mUser.notifications = [];
            }
            // @ts-ignore
            mUser.notifications.push(body);
            await UserModel.findByIdAndUpdate(mUser._id, {notifications: mUser.notifications});
        }));
        res.sendStatus(OK)

    }
}


export async function uploadPP(req: Request, res: Response) {
    // @ts-ignore
    console.log(req.files)
    await UserModel.findByIdAndUpdate(req.body._id, {
        // @ts-ignore
        pp: req.files[0].filename,
    })
    logger.info('pp upadated')

    res.json('/image api');
}


export async function getPP(req: Request, res: Response) {
    const filename = req.params.filename;
    const dirname = path.resolve();
    logger.info('getting image ' + filename)
    return res.sendFile(`${dirname}/images/${filename}`);
}



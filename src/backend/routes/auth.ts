import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import cookie_parser from 'cookie-parser';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in .env file');
}
let TOKEN_EXPIRY_DAYS = process.env.TOKEN_EXPIRY_DAYS || 30;
if (!TOKEN_EXPIRY_DAYS) {
    throw new Error('TOKEN_EXPIRY is not defined in .env file');
}
if (typeof TOKEN_EXPIRY_DAYS === 'string') {
    TOKEN_EXPIRY_DAYS = parseInt(TOKEN_EXPIRY_DAYS);
    if (isNaN(TOKEN_EXPIRY_DAYS)) {
        TOKEN_EXPIRY_DAYS = 30;
    }
}

export async function school_id_from_token(req: Request, res: Response){
    try{
        cookie_parser();
        const token = req.cookies.token;
        if (!token) {
            return undefined;
        }
        const school_id_from_token = await db
            .selectFrom('Login')
            .select(['school_id', 'expired_time'])
            .where('token', '=', token)
            .executeTakeFirst();
        if (!school_id_from_token) {
            return undefined;
        }
        const school_id = school_id_from_token.school_id;
        const expired_time = school_id_from_token.expired_time;
        if (new Date(expired_time) < new Date()) {
            return undefined;
        }
        // double check school_id is valid
        const school_id_from_profile = await db
            .selectFrom('Profile')
            .select('school_id')
            .where('school_id', '=', school_id)
            .executeTakeFirst();
        if (!school_id_from_profile) {
            return undefined;
        }
        let new_expired_time = new Date();
        if (typeof TOKEN_EXPIRY_DAYS === 'string') {
            TOKEN_EXPIRY_DAYS = parseInt(TOKEN_EXPIRY_DAYS);
            if (isNaN(TOKEN_EXPIRY_DAYS)) {
                TOKEN_EXPIRY_DAYS = 30;
            }
        }
        new_expired_time.setDate(new_expired_time.getDate() + TOKEN_EXPIRY_DAYS);
        const updated_expired_time_result = await db
            .updateTable('Login')
            .set('expired_time', new_expired_time.toISOString())
            .where('school_id', '=', school_id)
            .execute();
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' , expires: new_expired_time });
        return school_id;
    }
    catch (err) {
        console.error(err);
        return undefined;
    }
}

export async function check_is_banned(school_id: string){
    try{
        const ban_until = await db
            .selectFrom('Profile')
            .select('ban_until')
            .where('school_id', '=', school_id)
            .executeTakeFirst();
        if (!ban_until || ban_until.ban_until === '') {
            return false;
        }
        if (new Date(ban_until.ban_until) > new Date()) {
            return true;
        }
        if (new Date(ban_until.ban_until) <= new Date()) {
            const unban_result = await db
                .updateTable('Profile')
                .set('ban_until', '')
                .where('school_id', '=', school_id)
                .execute();
            return false;
        }
        
    }
    catch (err) {
        console.error(err);
        return false;
    }
}

//登入路由
router.post('/login', async ( req: express.Request, res: express.Response ) => {
    const { school_id, password } = req.body;
    if (!school_id || !password) {
        res.status(400).json({ message: 'School ID and password are required' });
    }

    try {
        //查詢用戶是否存在
        const user = await db
            .selectFrom('Profile')
            .selectAll()
            .where('school_id', '=', school_id)
            .executeTakeFirst();

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: 'Invalid school ID or password' });
        }
        //生成 JWT Token
        let expireTime = new Date();
        if (typeof TOKEN_EXPIRY_DAYS === 'string') {
            TOKEN_EXPIRY_DAYS = parseInt(TOKEN_EXPIRY_DAYS);
            if (isNaN(TOKEN_EXPIRY_DAYS)) {
                TOKEN_EXPIRY_DAYS = 30;
            }
        }
        expireTime.setDate(expireTime.getDate() + TOKEN_EXPIRY_DAYS);
        const token = jwt.sign({ school_id, expireTime}, JWT_SECRET, { expiresIn: `${TOKEN_EXPIRY_DAYS}d` });
        //插入 Login 表
        await db
            .insertInto('Login')
            .values({
                token,
                school_id,
                expired_time: expireTime.toISOString(),
            })
            .execute();
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' ,expires: expireTime });
        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//登出路由
router.post('/logout', cookie_parser() ,async (req: Request, res: Response) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(400).json({ message: 'Token is required' });
        return;
    }
    try {
        //檢查 Token 是否存在
        const tokenExists = await db
            .selectFrom('Login')
            .select('token')
            .where('token', '=', token)
            .executeTakeFirst();
        if (!tokenExists) {
            res.status(400).json({ message: 'Invalid token or session not found' });
        }
        //刪除 Token
        await db
            .deleteFrom('Login')
            .where('token', '=', token)
            .execute();
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;
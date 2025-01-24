import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenvFlow from 'dotenv-flow';
import { db } from '../db';
dotenvFlow.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in .env file');
}
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY;
if (!TOKEN_EXPIRY) {
    throw new Error('TOKEN_EXPIRY is not defined in .env file');
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
        const token = jwt.sign({ school_id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
        //計算 Token 過期時間
        const expireTime = new Date();
        expireTime.setMonth(expireTime.getMonth() + 1);
        //插入 Login 表
        await db
            .insertInto('Login')
            .values({
                token,
                school_id,
                expire_time: expireTime.toISOString(),
            })
            .execute();
        res.json({
            token,
            expire_time: expireTime.toISOString(),
            message: 'Login successful',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//登出路由
router.post('/logout', async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]; //從 https 的header提取 Token
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
        res.json({ message: 'Logout successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;
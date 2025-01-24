import express, { Request, Response } from 'express';
import { db } from '../db';

const router = express.Router();

export async function check_admin_level(school_id: string){
    const admin_level = await db
        .selectFrom('Profile')
        .select('admin_level')
        .where('school_id', '=', school_id)
        .executeTakeFirst();
    if (admin_level === undefined) {
        return undefined;
    }
    return admin_level.admin_level;
}

router.get('user-lists', async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(400).json({ message: 'Token is required' });
        return;
    }
    const school_id= await db
        .selectFrom('Login')
        .select('school_id')
        .where('token', '=', token)
        .executeTakeFirst();
    //TODO: that may be replace to a function to update expiretime
    if (!school_id) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
    const admin_level = await check_admin_level(school_id.school_id);
    if (!admin_level) {
        res.status(401).json({ message: 'Invalid school ID' });
        return;
    }
    let user_list_level = process.env.USER_LIST_LEVEL || 2;
    if (typeof user_list_level === 'string') {
        user_list_level = parseInt(user_list_level);
    }
    if (admin_level < user_list_level) {
        res.status(403).json({ message: 'Permission denied' });
        return;
    }
    const users = await db
        .selectFrom('Profile')
        .select(['school_id', 'name', 'ban_until'])
        .execute();
    res.json(users);
});

export default router;
import express, { Request, Response } from 'express';
import { db } from '../db';

const router = express.Router();

export async function check_admin_level(school_id: string){
    try{
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
    catch (err) {
        console.error(err);
        return undefined;
    }
    
}

router.get('user-lists', async (req: Request, res: Response) => {
    try{
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
            if (isNaN(user_list_level)) {
                user_list_level = 2;
            }
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/ban', express.json(), async (req: Request, res: Response) => {
    try{
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
        if(!school_id){
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        const admin_level = await check_admin_level(school_id.school_id);
        if (!admin_level) {
            res.status(401).json({ message: 'Invalid school ID' });
            return;
        }
        let ban_level = process.env.BAN_LEVEL || 3;
        if (typeof ban_level === 'string') {
            ban_level = parseInt(ban_level);
            if (isNaN(ban_level)) {
                ban_level = 3;
            }
        }
        if (admin_level < ban_level) {
            res.status(403).json({ message: 'Permission denied' });
            return;
        }
        const ban_school_id = req.body.school_id;
        const ban_until = req.body.ban_until;
        if (!ban_school_id || !ban_until) {
            res.status(400).json({ message: 'School ID and ban until are required' });
            return;
        }
        // if ban_until is not a time string
        if (isNaN(Date.parse(ban_until))) {
            res.status(400).json({ message: 'Invalid ban until' });
            return;
        }
        if (ban_until < new Date().toISOString()) {
            res.status(400).json({ message: 'Ban until must be in the future' });
            return;
        }
        // check if the user exists
        const ban_result = await db
            .updateTable('Profile')
            .set( {ban_until: ban_until} )
            .where('school_id', '=', ban_school_id)
            .executeTakeFirst();
        if (ban_result.numUpdatedRows === BigInt(0)) {
            res.status(400).json({ message: 'User not found' });
            return;
        }
        res.json({ message: `User ${ban_school_id} is banned until ${ban_until}` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/unban', express.json(), async (req: Request, res: Response) => {
    try{
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
        if(!school_id){
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        const admin_level = await check_admin_level(school_id.school_id);
        if (!admin_level) {
            res.status(401).json({ message: 'Invalid school ID' });
            return;
        }
        let ban_level = process.env.BAN_LEVEL || 3;
        if (typeof ban_level === 'string') {
            ban_level = parseInt(ban_level);
            if (isNaN(ban_level)) {
                ban_level = 3;
            }
        }
        if (admin_level < ban_level) {
            res.status(403).json({ message: 'Permission denied' });
            return;
        }
        const ban_school_id = req.body.school_id;
        if (!ban_school_id) {
            res.status(400).json({ message: 'School ID is required' });
            return;
        }
        // check if the user exists
        const unban_result = await db
            .updateTable('Profile')
            .set( {ban_until: ''} )
            .where('school_id', '=', ban_school_id)
            .executeTakeFirst();
        if (unban_result.numUpdatedRows === BigInt(0)) {
            res.status(400).json({ message: 'User not found' });
            return;
        }
        res.json({ message: `User ${ban_school_id} is unbanned` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
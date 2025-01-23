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

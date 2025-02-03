import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { db } from '../db';
import { check_admin_level } from './admin'
import { school_id_from_token, check_is_banned } from './auth';
import DotenvFlow from 'dotenv-flow';

DotenvFlow.config();

const router = express.Router();
const VERIFIED_DIR = process.env.VERIFIED_DIR || path.join(__dirname, './verified');
//確保 VERIFIED_DIR 存在
if (!fs.existsSync(VERIFIED_DIR)) {
    fs.mkdirSync(VERIFIED_DIR, { recursive: true });
}
let VERIFY_LEVEL = 2;
if (process.env.VERIFY_LEVEL !== undefined) {
    VERIFY_LEVEL = parseInt(process.env.VERIFY_LEVEL);
    if (isNaN(VERIFY_LEVEL)) {
        VERIFY_LEVEL = 2;
    }
}

//查看檔案詳細資訊並下載
router.get('/detail/:file_id', async (req: Request, res: Response) => {
    try {
        const school_id = await school_id_from_token(req, res);
        if (!school_id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const ban_until = await check_is_banned(school_id);
        if (ban_until !== false) {
            res.status(403).json({ message: 'You are banned', Ban_until: ban_until });
            return;
        }
        const file_id = parseInt(req.params.file_id, 10);
        if (isNaN(file_id)) {
            res.status(400).json({ message: 'Invalid file ID' });
            return;
        }
        //確認檔案是否存在於資料庫
        const file = await db
            .selectFrom('Document')
            .select(['pdf_locate as file_path', 'verified'])
            .where('id', '=', file_id)
            .executeTakeFirst();
        if (!file) {
            res.status(404).json({ message: 'File not found' });
            return;
        }
        const admin_level = await check_admin_level(school_id);
        if (!admin_level) {
            res.status(401).json({ message: 'Invalid school ID' });
            return;
        }
        if (file.verified === 0 && admin_level < VERIFY_LEVEL) {
            res.status(403).json({ message: 'File is not verified' });
            return;
        }
        //檢查檔案是否存在於 VERIFIED_DIR
        const filePath = path.join(VERIFIED_DIR, path.normalize(file.file_path));
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: 'File not found in verified directory' });
            return;
        }
        //傳送檔案
        res.status(200).sendFile(filePath);
    } catch (err) {
        console.error('Error fetching file details:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;

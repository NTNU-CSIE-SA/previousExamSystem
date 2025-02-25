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
if (!fs.existsSync(VERIFIED_DIR)) {
    fs.mkdirSync(VERIFIED_DIR, { recursive: true });
}
const UPLOAD_PATH = process.env.UPLOADS_PATH || path.join(__dirname, './uploads');
if (!fs.existsSync(UPLOAD_PATH)) {
    fs.mkdirSync(UPLOAD_PATH, { recursive: true });
}
let MODIFY_FILE_LEVEL = 3;
if (process.env.MODIFY_FILE_LEVEL !== undefined) {
    MODIFY_FILE_LEVEL = parseInt(process.env.MODIFY_FILE_LEVEL);
    if (isNaN(MODIFY_FILE_LEVEL)) {
        MODIFY_FILE_LEVEL = 3;
    }
}

//查看檔案詳細資訊並下載
router.get('/:file_id', async (req: Request, res: Response) => {
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
        if (admin_level === undefined) {
            res.status(401).json({ message: 'Invalid school ID' });
            return;
        }
        if (file.verified === 0 && admin_level < MODIFY_FILE_LEVEL) {
            res.status(403).json({ message: 'File is not verified' });
            return;
        }
        if (file.verified === 0) {
            const filePath = path.join(UPLOAD_PATH, path.normalize(file.file_path));
            if (!fs.existsSync(filePath)) {
                res.status(404).json({ message: 'File not found in upload directory' });
                return;
            }
            res.status(200).sendFile(filePath, { root: './' });
            return;
        }
        else {
            const filePath = path.join(VERIFIED_DIR, path.normalize(file.file_path));
        if (!fs.existsSync(filePath)) {
            res.status(404).json({ message: 'File not found in verified directory' });
            return;
            }
            res.status(200).sendFile(filePath, { root: './' });
        }
    } catch (err) {
        console.error('Error fetching file details:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;

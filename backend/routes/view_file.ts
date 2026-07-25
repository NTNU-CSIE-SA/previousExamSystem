import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { db } from '../db';
import { check_admin_level } from './admin'
import { school_id_from_token, check_is_banned } from './auth';
import DotenvFlow from 'dotenv-flow';
import { fileLockManager } from '../lock';

DotenvFlow.config();

const router = express.Router();
const VERIFIED_DIR = './verified';
if (!fs.existsSync(VERIFIED_DIR)) {
    fs.mkdirSync(VERIFIED_DIR, { recursive: true });
}
const UPLOADS_DIR = './uploads';
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
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
    let needReleaseLock = false;
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
        const file_id = parseInt(req.params.file_id as string, 10);
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

        await fileLockManager.readLock(file_id);
        needReleaseLock = true;

        if (file.verified === 0) {
            const filePath = path.join(UPLOADS_DIR, path.normalize(file.file_path));
            console.log(filePath);
            if (!fs.existsSync(filePath)) {
                res.status(404).json({ message: 'File not found in upload directory' });
                return;
            }
            res.status(200).sendFile(filePath, { root: './' }, async (err) => {
                if (err) console.error(err);
                await fileLockManager.readUnlock(file_id);
            });
            needReleaseLock = false; // Transfer lock release to sendFile callback
            return;
        }
        else {
            const filePath = path.join(VERIFIED_DIR, path.normalize(file.file_path));
            if (!fs.existsSync(filePath)) {
                res.status(404).json({ message: 'File not found in verified directory' });
                return;
            }
            res.status(200).sendFile(filePath, { root: './' }, async (err) => {
                if (err) console.error(err);
                await fileLockManager.readUnlock(file_id);
            });
            needReleaseLock = false; // Transfer lock release to sendFile callback
        }
    } catch (err) {
        console.error('Error fetching file details:', err);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (needReleaseLock) {
            await fileLockManager.readUnlock(parseInt(req.params.file_id as string, 10));
        }
    }
});
export default router;

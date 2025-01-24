import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { db } from '../db';
import { check_admin_level } from './admin'
const router = express.Router();
const VERIFIED_DIR = process.env.VERIFIED_DIR || path.join(__dirname, '../../verified');
//確保 VERIFIED_DIR 存在
if (!fs.existsSync(VERIFIED_DIR)) {
    fs.mkdirSync(VERIFIED_DIR, { recursive: true });
}

//查看檔案詳細資訊並下載
router.get('/detail/:file_id', async (req: Request, res: Response) => {
    try {
        const token = req.headers.cookie?.split('=')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized: Missing cookie' });
            return;
        }
        //確認 token 是否有效且未過期
        const session = await db
            .selectFrom('Login')
            .selectAll()
            .where('token', '=', token)
            .where('expired_time', '>', new Date().toISOString()) //確保未過期
            .executeTakeFirst();
        if (!session) {
            res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
            return;
        }
        //檢查使用者是否被 ban
        const admin_level = await check_admin_level(session.school_id);
        if (admin_level === undefined || admin_level < 0) {
            res.status(403).json({message: 'User is banned'});
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
        //檢查檔案是否已驗證
        if (file.verified !== 1) {
            res.status(403).json({ message: 'File is not verified' });
            return;
        }
        //檢查檔案是否存在於 VERIFIED_DIR
        const filePath = path.join(VERIFIED_DIR, path.normalize(file.file_path));
        if (!filePath.startsWith(VERIFIED_DIR) || !fs.existsSync(filePath)) {
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

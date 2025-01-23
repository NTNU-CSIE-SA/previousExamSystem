import express, { Request, Response } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import dotenvFlow from 'dotenv-flow';
import { db } from '../db';

dotenvFlow.config(); //讀取 .env 配置

const router = express.Router();

//從 .env 檔案中讀取檔案儲存路徑，預設為'./uploads'
const UPLOADS_DIR = process.env.UPLOADS_DIR || './uploads';
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

//設定 multer
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOADS_DIR);
        },
        filename: (req, file, cb) => {
            //生成唯一 ID 作為檔案名稱
            const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
            cb(null, `${uniqueSuffix}.pdf`);
        },
    }),
    fileFilter: (req, file, cb) => {
        //僅接受 PDF 檔案
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 100 * 1024 * 1024, //最大 100MB
    },
});

//上傳檔案路由
router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
    try {
        //確認 cookie 是否存在
        const token = req.headers.cookie?.split('=')[1];
        if (!token) {
            res.status(401).json({ message: 'Unauthorized: Missing cookie' });
            return;
        }

        //確認 token 是否有效
        const session = await db
            .selectFrom('Login')
            .selectAll()
            .where('token', '=', token)
            .executeTakeFirst();

        if (!session) {
            res.status(401).json({ message: 'Unauthorized: Invalid token' });
            return;
        }

        //確認是否有上傳檔案
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        //生成唯一 ID
        const uniqueId = parseInt(crypto.randomBytes(4).toString('hex'), 16);

        //檔案相關資訊
        const { originalname, filename, size } = req.file;
        const uploadTime = new Date().toISOString();

        //將檔案新增至 SQL 資料庫
        await db
            .insertInto('Document')
            .values({
                id: uniqueId,
                upload_time: uploadTime,
                uploader_id: session.school_id,
                pdf_locate: filename,
                subject: req.body.subject || 'Unknown',
                semester: req.body.semester || 'Unknown',
                exam_type: req.body.exam_type || 'Unknown',
                verified: 0,//預設未驗證
            })
            .execute();

        //回傳成功訊息
        res.status(200).json({
            message: 'File uploaded successfully',
            fileInfo: {
                id: uniqueId,
                name: originalname,
                size,
                uploadTime,
            },
        });
    } catch (error: any) {
        console.error(error);
        if (error instanceof multer.MulterError) {
            res.status(400).json({ message: `Multer error: ${error.message}` });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});
export default router;
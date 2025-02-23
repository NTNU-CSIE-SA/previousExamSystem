import express, { Request, Response } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import { school_id_from_token } from './auth';
import { db } from '../db';
import DotenvFlow from 'dotenv-flow';

DotenvFlow.config();

const router = express.Router();

//從 .env 檔案中讀取檔案儲存路徑，預設為'./uploads'
const UPLOADS_DIR = process.env.UPLOADS_DIR || './uploads';
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
let MAX_FILE_SIZE = 100;
if (process.env.MAX_FILE_SIZE !== undefined) {
    MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE);
    if (isNaN(MAX_FILE_SIZE)) {
        MAX_FILE_SIZE = 100;
    }
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
        fileSize: MAX_FILE_SIZE * 1024 * 1024, //最大 100MB
    },
});

//上傳檔案路由
router.post('/upload', upload.single('file'), (err: any, req: Request, res: Response, next: any) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({ message: `Only accept PDF files, max size: ${MAX_FILE_SIZE}MB` });
    } else if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ message: `File size too large, max size: ${MAX_FILE_SIZE}MB` });
    } else if (err.code === 'Only PDF files are allowed') {
        res.status(400).json({ message: 'Only accept PDF files' });
    }
    else if (err.message === 'Only PDF files are allowed') {
        res.status(400).json({ message: 'Only accept PDF files' });
    }
    else if (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
},
    async (req: Request, res: Response) => {
        try {
            const school_id = await school_id_from_token(req, res);
            if (!school_id) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            //確認是否有上傳檔案
            console.log(req.file);
            if (!req.file) {
                res.status(400).json({ message: 'No file uploaded' });
                return;
            }
            if (!req.body.subject || !req.body.semester || !req.body.exam_type) {
                fs.promises.unlink(`${UPLOADS_DIR}/${req.file.filename}`);
                res.status(400).json({ message: 'Subject, semester, and exam_type are required' });
                return;
            }
            if (!((req.body.subject.length > 0 && typeof req.body.subject === 'string') && (req.body.semester.length > 0 && typeof req.body.semester === 'string') && (req.body.exam_type.length > 0 && typeof req.body.exam_type === 'string'))) {
                fs.promises.unlink(`${UPLOADS_DIR}/${req.file.filename}`);
                res.status(400).json({ message: 'Invalid input type' });
                return;
            }
            // check magic number (%PDF)
            const magic = await fs.promises.open(`${UPLOADS_DIR}/${req.file.filename}`, 'r');
            const buffer = Buffer.alloc(4);
            const read_return = await magic.read(buffer, 0, 4, 0);
            if (read_return.bytesRead !== 4) {
                fs.promises.unlink(`${UPLOADS_DIR}/${req.file.filename}`);
                res.status(400).json({ message: 'Error reading file' });
                await magic.close();
                return;
            }
            if (buffer.toString('hex') !== '25504446') {
                fs.promises.unlink(`${UPLOADS_DIR}/${req.file.filename}`);
                res.status(400).json({ message: 'Invalid file format' });
                await magic.close();
                return;
            }
            await magic.close();
            //生成唯一 ID
            const now_time = new Date().getTime();
            const uniqueId = now_time * 1000 + parseInt(crypto.createHash('sha256').update(now_time.toString()).digest('hex').slice(0, 6), 16) % 1000;
            //檔案相關資訊
            const { originalname, filename, size } = req.file;
            const uploadTime = new Date().toISOString();

            //將檔案新增至 SQL 資料庫
            await db
                .insertInto('Document')
                .values({
                    id: uniqueId,
                    upload_time: uploadTime,
                    uploader_id: school_id,
                    pdf_locate: filename,
                    subject: req.body.subject || 'Unknown',
                    semester: req.body.semester || 'Unknown',
                    exam_type: req.body.exam_type || 'Unknown',
                    verified: 0
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
            res.status(500).json({ message: 'Internal server error' });
        }
    });

router.get('/upload-limit', (req: Request, res: Response) => {
    res.status(200).json({ limit_MB: MAX_FILE_SIZE });
});

export default router;
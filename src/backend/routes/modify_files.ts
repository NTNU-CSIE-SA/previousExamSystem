import express, { Request, Response } from 'express';
import fs from 'fs';
import { school_id_from_token } from './auth';
import { check_admin_level } from './admin';
import { db } from '../db';
import DotenvFlow from 'dotenv-flow';

DotenvFlow.config();

let VERIFY_LEVEL = 2;
if (process.env.VERIFY_LEVEL !== undefined) {
    VERIFY_LEVEL = parseInt(process.env.VERIFY_LEVEL);
    if (isNaN(VERIFY_LEVEL)) {
        VERIFY_LEVEL = 2;
    }
}

let MODIFY_FILES_LEVEL = 4;
if (process.env.MODIFY_FILES_LEVEL !== undefined) {
    MODIFY_FILES_LEVEL = parseInt(process.env.MODIFY_FILES_LEVEL);
    if (isNaN(MODIFY_FILES_LEVEL)) {
        MODIFY_FILES_LEVEL = 4;
    }
}

let VERIFIED_DIR = '../../verfied';
if (process.env.VERIFIED_DIR !== undefined) {
    VERIFIED_DIR = process.env.VERIFIED_DIR;
}

let UPLOADS_DIR = './uploads';
if (process.env.UPLOADS_DIR !== undefined) {
    UPLOADS_DIR = process.env.UPLOADS_DIR;
}

const router = express.Router();

router.post('/verify', async (req: Request, res: Response) => {
    try{
        const school_id = await school_id_from_token(req, res);
        if (!school_id) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        const admin_level = await check_admin_level(school_id);
        if (!admin_level) {
            res.status(401).json({ message: 'Invalid school ID' });
            return;
        }
        if (admin_level < VERIFY_LEVEL) {
            res.status(403).json({ message: 'Permission denied' });
            return;
        }
        const file_id = req.body.file_id;
        if (!file_id) {
            res.status(400).json({ message: 'File ID is required' });
            return;
        }
        const file = await db
            .selectFrom('Document')
            .selectAll()
            .where('id', '=', file_id)
            .executeTakeFirst();
        if (!file) {
            res.status(404).json({ message: 'File not found' });
            return;
        }
        if (file.verified) {
            res.status(400).json({ message: 'File is already verified' });
            return;
        }
        if (!fs.existsSync(`${UPLOADS_DIR}/${file.pdf_locate}`)) {
            res.status(404).json({ message: 'File not found' });
            return;
        }
        if (!fs.existsSync(`${VERIFIED_DIR}`)) {
            fs.mkdirSync(`${VERIFIED_DIR}`, { recursive: true });
        }
        fs.rename(`${UPLOADS_DIR}/${file.pdf_locate}`, `${VERIFIED_DIR}/${file.id}`, (err) => { 
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }
        });
        await db
            .updateTable('Document')
            .set({ verified: 1 , pdf_locate: `${file.id}`})
            .where('id', '=', file_id)
            .execute();
        res.json({ message: `File ${file_id} verified` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/delete', async (req: Request, res: Response) => {
    try{
        const school_id = await school_id_from_token(req, res);
        if (!school_id) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        const admin_level = await check_admin_level(school_id);
        if (!admin_level) {
            res.status(401).json({ message: 'Invalid school ID' });
            return;
        }
        if (admin_level < MODIFY_FILES_LEVEL) {
            res.status(403).json({ message: 'Permission denied' });
            return;
        }
        const file_id = req.body.file_id;
        if (!file_id) {
            res.status(400).json({ message: 'File ID is required' });
            return;
        }
        const file = await db
            .selectFrom('Document')
            .selectAll()
            .where('id', '=', file_id)
            .executeTakeFirst();
        if (!file) {
            res.status(404).json({ message: 'File not found' });
            return;
        }
        if (file.verified) {
            res.status(400).json({ message: 'Cannot delete verified file' });
            return;
        }
        if (!fs.existsSync(`${UPLOADS_DIR}/${file.pdf_locate}`)) {
            res.status(404).json({ message: 'File not found' });
            return;
        }
        fs.unlink(`${UPLOADS_DIR}/${file.pdf_locate}`, (err) => { 
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }
        });
        await db
            .deleteFrom('Document')
            .where('id', '=', file_id)
            .execute();
        res.json({ message: `File ${file_id} deleted` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/modify-file-info', async (req: Request, res: Response) => {
    try{
        const school_id = await school_id_from_token(req, res);
        if (!school_id) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        const admin_level = await check_admin_level(school_id);
        if (!admin_level) {
            res.status(401).json({ message: 'Invalid school ID' });
            return;
        }
        if (admin_level < MODIFY_FILES_LEVEL) {
            res.status(403).json({ message: 'Permission denied' });
            return;
        }
        const file_id = req.body.file_id;
        if (!file_id) {
            res.status(400).json({ message: 'File ID is required' });
            return;
        }
        const file = await db
            .selectFrom('Document')
            .selectAll()
            .where('id', '=', file_id)
            .executeTakeFirst();
        if (!file) {
            res.status(404).json({ message: 'File not found' });
            return;
        }
        const subject = req.body.subject;
        const semester = req.body.semester;
        const exam_type = req.body.exam_type;
        const verfied = req.body.verified;
        if (verfied !== undefined && (verfied < 0 || verfied > 1)) {
            res.status(400).json({ message: 'Invalid verified value' });
            return;
        }
        if ((subject !== undefined && typeof subject !== 'string') || (typeof subject === 'string' && subject.length === 0)
            || (semester !== undefined && typeof semester !== 'string') || (typeof semester === 'string' && semester.length === 0)
            || (exam_type !== undefined && typeof exam_type !== 'string') || (typeof exam_type === 'string' && exam_type.length === 0)) {
            res.status(400).json({ message: 'Invalid input type' });
            return;
        }
        if (subject.length > 100 || semester.length > 100 || exam_type.length > 100 ) {
            res.status(400).json({ message: 'Invalid input' });
            return;
        }
        if (file.verified === 1 && verfied === 0) {
            if (!fs.existsSync(`${VERIFIED_DIR}/${file.id}`)) {
                res.status(404).json({ message: 'File not found' });
                return;
            }
            if (!fs.existsSync(`${UPLOADS_DIR}`)) {
                fs.mkdirSync(`${UPLOADS_DIR}`, { recursive: true });
            }
            fs.rename(`${VERIFIED_DIR}/${file.id}`, `${UPLOADS_DIR}/${file.pdf_locate}`, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
            });
        }
        else if (file.verified === 0 && verfied === 1) {
            if (!fs.existsSync(`${UPLOADS_DIR}/${file.pdf_locate}`)) {
                res.status(404).json({ message: 'File not found' });
                return;
            }
            if (!fs.existsSync(`${VERIFIED_DIR}`)) {
                fs.mkdirSync(`${VERIFIED_DIR}`, { recursive: true });
            }
            fs.rename(`${UPLOADS_DIR}/${file.pdf_locate}`, `${VERIFIED_DIR}/${file.id}`, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
            });
        }
        await db
            .updateTable('Document')
            .$if(subject !== undefined, (qb) => qb.set({ subject: subject }))
            .$if(semester !== undefined, (qb) => qb.set({ semester: semester }))
            .$if(exam_type !== undefined, (qb) => qb.set({ exam_type: exam_type }))
            .$if(verfied !== undefined, (qb) => qb.set({ verified: verfied }))
            .where('id', '=', file_id)
            .execute();
        res.json({ message: `File ${file_id} modified` });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
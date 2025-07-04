import express, { Request, Response } from 'express';
import fs from 'fs';
import { school_id_from_token } from './auth';
import { check_admin_level } from './admin';
import { db } from '../db';
import DotenvFlow from 'dotenv-flow';

DotenvFlow.config();


let MODIFY_FILE_LEVEL = 3;
if (process.env.MODIFY_FILE_LEVEL !== undefined) {
    MODIFY_FILE_LEVEL = parseInt(process.env.MODIFY_FILE_LEVEL);
    if (isNaN(MODIFY_FILE_LEVEL)) {
        MODIFY_FILE_LEVEL = 3;
    }
}

let VERIFIED_DIR = './verified';
let UPLOADS_DIR = './uploads';


const router = express.Router();

router.post('/verify', async (req: Request, res: Response) => {
    try{
        const school_id = await school_id_from_token(req, res);
        if (!school_id) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        const admin_level = await check_admin_level(school_id);
        if (admin_level === undefined) {
            res.status(401).json({ message: 'Invalid school ID' });
            return;
        }
        if (admin_level < MODIFY_FILE_LEVEL) {
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
        fs.rename(`${UPLOADS_DIR}/${file.pdf_locate}`, `${VERIFIED_DIR}/${file.id}.pdf`, (err) => { 
            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Internal server error' });
                return;
            }
        });
        await db
            .updateTable('Document')
            .set({ verified: 1 , pdf_locate: `${file.id}.pdf`})
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
        if (admin_level === undefined) {
            res.status(401).json({ message: 'Invalid school ID' });
            return;
        }
        if (admin_level < MODIFY_FILE_LEVEL) {
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
        if (admin_level === undefined) {
            res.status(401).json({ message: 'Invalid school ID' });
            return;
        }
        if (admin_level < MODIFY_FILE_LEVEL) {
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
        const verified = req.body.verified;
        if (verified !== undefined && (verified < 0 || verified > 1)) {
            res.status(400).json({ message: 'Invalid verified value' });
            return;
        }
        if ((subject !== undefined && typeof subject !== 'string') ||
            (semester !== undefined && typeof semester !== 'string') ||
            (exam_type !== undefined && typeof exam_type !== 'string')) {
            res.status(400).json({ message: 'Invalid input type' });
            return;
        }
        if(subject === '' || semester === '' || exam_type === ''){
            res.status(400).json({ message: 'Subject, semester, and exam_type are required' });
            return;
        }
        if ((typeof subject === 'string' && subject.length > 100) || (typeof semester === 'string' && semester.length > 100) || (typeof exam_type === 'string' && exam_type.length > 100)) {
            res.status(400).json({ message: 'Invalid input' });
            return;
        }
        if (file.verified === 1 && verified === 0) {
            if (!fs.existsSync(`${VERIFIED_DIR}/${file.pdf_locate}`)) {
                res.status(404).json({ message: 'File not found' });
                return;
            }
            if (!fs.existsSync(`${UPLOADS_DIR}`)) {
                fs.mkdirSync(`${UPLOADS_DIR}`, { recursive: true });
            }
            fs.rename(`${VERIFIED_DIR}/${file.pdf_locate}`, `${UPLOADS_DIR}/${file.pdf_locate}`, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
            });
        }
        else if (file.verified === 0 && verified === 1) {
            if (!fs.existsSync(`${UPLOADS_DIR}/${file.pdf_locate}`)) {
                res.status(404).json({ message: 'File not found' });
                return;
            }
            if (!fs.existsSync(`${VERIFIED_DIR}`)) {
                fs.mkdirSync(`${VERIFIED_DIR}`, { recursive: true });
            }
            fs.rename(`${UPLOADS_DIR}/${file.pdf_locate}`, `${VERIFIED_DIR}/${file.id}.pdf`, (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ message: 'Internal server error' });
                    return;
                }
            });
            await db
                .updateTable('Document')
                .set({ pdf_locate: `${file.id}.pdf` })
                .where('id', '=', file_id)
                .execute();
        }
        if (subject === undefined && semester === undefined && exam_type === undefined && verified === undefined) {
            res.status(400).json({ message: 'No modification' });
            return;
        }
        await db
            .updateTable('Document')
            .$if(subject !== undefined, (qb) => qb.set({ subject: subject }))
            .$if(semester !== undefined, (qb) => qb.set({ semester: semester }))
            .$if(exam_type !== undefined, (qb) => qb.set({ exam_type: exam_type }))
            .$if(verified !== undefined, (qb) => qb.set({ verified: verified }))
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
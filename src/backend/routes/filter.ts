import express, { Request, Response } from 'express';
import { db } from '../db';
import { check_admin_level } from './admin';
import { school_id_from_token } from './auth';
import DotenvFlow from 'dotenv-flow';

DotenvFlow.config();

let MODIFY_FILE_LEVEL = 3;
if (process.env.MODIFY_FILE_LEVEL !== undefined) {
    MODIFY_FILE_LEVEL = parseInt(process.env.MODIFY_FILE_LEVEL);
    if (isNaN(MODIFY_FILE_LEVEL)) {
        MODIFY_FILE_LEVEL = 3;
    }
}

const router = express.Router();

router.get('/tags', async (req: Request, res: Response) => {
    try {
        console.log(req.query);
        let tags_opt = req.query.tags || 'verified';
        if (tags_opt !== 'all' && tags_opt !== 'unverified' && tags_opt !== 'verified') {
            tags_opt = 'verified';
        }
        const subject_tags = await db
            .selectFrom('Document')
            .select('subject')
            .$if(tags_opt === 'verified' || tags_opt === undefined, (qb) => qb.where('verified', '=', 1))
            .$if(tags_opt === 'unverified', (qb) => qb.where('verified', '=', 0))
            .distinct()
            .execute();
        const semester_tags = await db
            .selectFrom('Document')
            .select('semester')
            .$if(tags_opt === 'verified' || tags_opt === undefined, (qb) => qb.where('verified', '=', 1))
            .$if(tags_opt === 'unverified', (qb) => qb.where('verified', '=', 0))
            .distinct()
            .execute();
        const exam_type_tags = await db
            .selectFrom('Document')
            .select('exam_type')
            .$if(tags_opt === 'verified' || tags_opt === undefined, (qb) => qb.where('verified', '=', 1))
            .$if(tags_opt === 'unverified', (qb) => qb.where('verified', '=', 0))
            .distinct()
            .execute();
        const tags = {
            subject: subject_tags.map((tag) => tag.subject),
            semester: semester_tags.map((tag) => tag.semester),
            exam_type: exam_type_tags.map((tag) => tag.exam_type),
        };
        res.json(tags);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/file-lists', async (req: Request, res: Response) => {
    try {
        const school_id = await school_id_from_token(req, res);
        if (!school_id) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        const subject = req.body.subject;
        const semester = req.body.semester;
        const exam_type = req.body.exam_type;

        if (!subject || !semester || !exam_type) {
            res.status(400).json({ message: 'Subject, semester and exam type are required' });
            return;
        }
        const admin_level = await check_admin_level(school_id);
        if (admin_level === undefined) {
            res.status(401).json({ message: 'Invalid school ID' });
            return;
        }
        if (admin_level < MODIFY_FILE_LEVEL) {
            const file_list = await db
                .selectFrom('Document')
                .select(['id', 'upload_time', 'subject', 'semester', 'exam_type'])
                .$if(subject.length > 0, (qb) => qb.where('subject', '=', subject))
                .$if(semester.length > 0, (qb) => qb.where('semester', '=', semester))
                .$if(exam_type.length > 0, (qb) => qb.where('exam_type', '=', exam_type))
                .where('verified', '=', 1)
                .execute();
            console.log(file_list);
            res.json(file_list);
        }
        else {
            let verified = req.body.verified;
            const file_list = await db
                .selectFrom('Document')
                .select(['id', 'upload_time', 'subject', 'semester', 'exam_type', 'verified'])
                .$if(subject.length > 0, (qb) => qb.where('subject', '=', subject))
                .$if(semester.length > 0, (qb) => qb.where('semester', '=', semester))
                .$if(exam_type.length > 0, (qb) => qb.where('exam_type', '=', exam_type))
                .$if(verified !== undefined && verified >= 0, (qb) => qb.where('verified', '=', verified))
                .$if(verified === undefined, (qb) => qb.where('verified', '=', 1))
                .execute();
            res.json(file_list);
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
import express, { Request, Response } from 'express';
import { db } from '../db';
import { check_admin_level } from './admin';

const router = express.Router();

router.get('/tags', async (req: Request, res: Response) => {
    const subject_tags = await db
        .selectFrom('Document')
        .select('subject')
        .distinct()
        .execute();
    const semester_tags = await db
        .selectFrom('Document')
        .select('semester')
        .distinct()
        .execute();
    const exam_type_tags = await db
        .selectFrom('Document')
        .select('exam_type')
        .distinct()
        .execute();
    const tags = {
        subject: subject_tags.map((tag) => tag.subject),
        semester: semester_tags.map((tag) => tag.semester),
        exam_type: exam_type_tags.map((tag) => tag.exam_type),
    };
    res.json(tags);
    
});

router.post('/file-lists', express.json(), async (req: Request, res: Response) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(400).json({ message: 'Token is required' });
        return;
    }
    const school_id= await db
        .selectFrom('Login')
        .select('school_id')
        .where('token', '=', token)
        .executeTakeFirst();
    // TODO: that may be replace to a function to update expiretime
    if (!school_id) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
    const subject = req.body.subject;
    const semester = req.body.semester;
    const exam_type = req.body.exam_type;
    let unverified_file_level = process.env.UNVERIFIED_FILE_LEVEL || 2;
    if (typeof unverified_file_level === 'string') {
        unverified_file_level = parseInt(unverified_file_level);
    }
    if (!subject || !semester || !exam_type) {
        res.status(400).json({ message: 'Subject, semester and exam type are required' });
        return;
    }
    const admin_level = await check_admin_level(school_id.school_id);
    if (!admin_level) {
        res.status(401).json({ message: 'Invalid school ID' });
        return;
    }
    if (admin_level < unverified_file_level) {
        const file_list = await db
            .selectFrom('Document')
            .select(['id', 'upload_time', 'subject', 'semester', 'exam_type'])
            .$if(subject.length > 0, (qb) => qb.where('subject', '=', subject))
            .$if(semester.length > 0, (qb) => qb.where('semester', '=', semester))
            .$if(exam_type.length > 0, (qb) => qb.where('exam_type', '=', exam_type))
            .where('verified', '=', 1)
            .execute();
        res.json(file_list);
    }
    else {
        const verified = req.body.verify;
        const file_list = await db
            .selectFrom('Document')
            .select(['id', 'upload_time', 'subject', 'semester', 'exam_type'])
            .$if(subject.length > 0, (qb) => qb.where('subject', '=', subject))
            .$if(semester.length > 0, (qb) => qb.where('semester', '=', semester))
            .$if(exam_type.length > 0, (qb) => qb.where('exam_type', '=', exam_type))
            .$if(verified !== undefined, (qb) => qb.where('verified', '=', verified))
            .$if(verified === undefined, (qb) => qb.where('verified', '=', 1))
            .execute();
        res.json(file_list);
    }
});

export default router;
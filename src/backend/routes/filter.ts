import express, { Request, Response } from 'express';
import { db } from '../db';

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

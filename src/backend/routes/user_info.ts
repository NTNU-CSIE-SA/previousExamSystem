import express, { Request, Response } from 'express';
import { db } from '../db';
import { school_id_from_token } from './auth';

const router = express.Router();

router.post('/change-name', async (req: Request, res: Response) => {
    try {
        const school_id = await school_id_from_token(req, res);
        if (!school_id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const new_name = req.body.new_name;
        if (!new_name) {
            res.status(400).json({ message: 'New name is required' });
            return;
        }
        if (typeof new_name !== 'string') {
            res.status(400).json({ message: 'New name must be a string' });
            return;
        }
        if (typeof new_name === 'string' && new_name.length > 50 || new_name.length < 1) {
            res.status(400).json({ message: 'New name length must be between 1 and 50' });
            return;
        }
        await db
            .updateTable('Profile')
            .set('name', new_name)
            .where('school_id', '=', school_id)
            .execute();
        res.json({ message: 'Name changed' });
        return;
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;    
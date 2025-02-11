import express, { Request, Response } from 'express';
import fs from 'fs';
import { PDFDocument, PDFImage } from 'pdf-lib';
import { school_id_from_token } from './auth';
import { check_admin_level } from './admin';
import { db } from '../db';
import DotenvFlow from 'dotenv-flow';

DotenvFlow.config();

let MODIFY_FILES_LEVEL = 4;
if (process.env.MODIFY_FILES_LEVEL !== undefined) {
    MODIFY_FILES_LEVEL = parseInt(process.env.MODIFY_FILES_LEVEL);
    if (isNaN(MODIFY_FILES_LEVEL)) {
        MODIFY_FILES_LEVEL = 4;
    }
}

let UPLOADS_PATH = './uploads';
if (process.env.UPLOADS_PATH !== undefined) {
    UPLOADS_PATH = process.env.UPLOADS_PATH;
}

const WATERMARK_PATH = process.env.WATERMARK_PATH;
let WATERMARK_TYPE = 'none';
if (WATERMARK_PATH !== undefined) {
    try {
        //check magic number of the file
        if (!fs.existsSync(WATERMARK_PATH)) {
            console.error('Watermark file does not exist');
            WATERMARK_TYPE = 'none';
        }
        else {
            let watermark_file = fs.openSync(WATERMARK_PATH, 'r');
            let buffer = Buffer.alloc(4);
            const read_return = fs.readSync(watermark_file, buffer, 0, 4, 0);
            if (read_return !== 4) {
                console.error('Error reading watermark file');
                WATERMARK_TYPE = 'none';
            }
            // check if the file is a PNG file
            else if (buffer.toString('hex') === '89504e47') {
                WATERMARK_TYPE = 'png';
            }
            // check if the file is a JPEG file fist 3 bytes are 0xffd8ff
            else if (buffer.toString('hex', 0, 3) === 'ffd8ff') {
                WATERMARK_TYPE = 'jpeg';
            }
            fs.close(watermark_file, (err) => {
                if (err) {
                    console.error('Error closing watermark file:', err);
                }
            });
        }
    } catch (error) {
        console.error('Error reading watermark file:', error);
    }
}
let WATERMARK_OPACITY = 0.3;
if (process.env.WATERMARK_OPACITY !== undefined) {
    WATERMARK_OPACITY = parseFloat(process.env.WATERMARK_OPACITY);
    if (isNaN(WATERMARK_OPACITY)) {
        WATERMARK_OPACITY = 0.3;
    }
}

let WATERMARK_WIDTH = 0.5;
if (process.env.WATERMARK_WIDTH !== undefined) {
    WATERMARK_WIDTH = parseFloat(process.env.WATERMARK_WIDTH);
    if (isNaN(WATERMARK_WIDTH)) {
        WATERMARK_WIDTH = 0.5;
    }
}

let ORIGIN_FILE_PATH = './origin';
if (process.env.ORIGIN_FILE_PATH !== undefined) {
    ORIGIN_FILE_PATH = process.env.ORIGIN_FILE_PATH;
}
if (!fs.existsSync(ORIGIN_FILE_PATH)) {
    fs.mkdirSync(ORIGIN_FILE_PATH, { recursive: true });
}


const router = express.Router();

router.post('/watermark', async (req: Request, res: Response) => {
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
        const pdf_path = await db
            .selectFrom('Document')
            .selectAll()
            .where('id', '=', file_id)
            .executeTakeFirst();
        if (!pdf_path) {
            res.status(404).json({ message: 'File not found' });
            return;
        }
        if (pdf_path.verified === 1) {
            res.status(400).json({ message: 'File is already verified' });
            return;
        }
        if (!fs.existsSync(`${UPLOADS_PATH}/${pdf_path.pdf_locate}`)) {
            res.status(404).json({ message: 'File not found' });
            return;
        }
        const file_path = `${UPLOADS_PATH}/${pdf_path.pdf_locate}`;
        const origin_file_path = `${ORIGIN_FILE_PATH}/${pdf_path.id}.pdf`;
        await fs.promises.copyFile(file_path, origin_file_path);
        const pdf_file = await fs.promises.readFile(file_path);
        const pdfDoc = await PDFDocument.load(pdf_file);
        const watermark_text = req.body.watermark_text;
        if (typeof watermark_text === 'string') {
            const pages = pdfDoc.getPages();
            for (let i = 0; i < pages.length; i++) {
                const { width, height } = pages[i].getSize();
                const text_size = 50;
                pages[i].drawText(watermark_text, {
                    x: (width - (watermark_text.length * text_size / 2)) / 2,
                    y: (height - text_size / 2) / 2,
                    size: 50,
                    opacity: WATERMARK_OPACITY,
                });
            }
            const pdf_bytes = await pdfDoc.save();
            fs.promises.writeFile(file_path, pdf_bytes);
            res.status(200).json({ message: `watermark added to file: ${file_id}` });
            return;
        }
        else if (typeof watermark_text === 'undefined') {
            if (WATERMARK_TYPE === 'none') {
                res.status(501).json({ message: 'Invalid watermark file' });
                return;
            }
            let image: PDFImage;
            if (WATERMARK_TYPE === 'png') {
                if (WATERMARK_PATH === undefined) {
                    res.status(501).json({ message: 'Invalid watermark file' });
                    return;
                }
                const image_png = await fs.promises.readFile(WATERMARK_PATH);
                image = await pdfDoc.embedPng(image_png);
            }
            else if (WATERMARK_TYPE === 'jpeg') {
                if (WATERMARK_PATH === undefined) {
                    res.status(501).json({ message: 'Invalid watermark file' });
                    return;
                }
                const image_jpeg = await fs.promises.readFile(WATERMARK_PATH);
                image = await pdfDoc.embedJpg(image_jpeg);
                // Add watermark to each page
            }
            else {
                res.status(501).json({ message: 'Invalid watermark file' });
                return;
            }
            const pages = pdfDoc.getPages();
            for (let i = 0; i < pages.length; i++) {
                const { width, height } = pages[i].getSize();
                const img_width = width * WATERMARK_WIDTH;
                const img_height = (image.height / image.width) * img_width;
                pages[i].drawImage(image, {
                    x: (width - img_width) / 2,
                    y: (height - img_height) / 2,
                    width: img_width,
                    height: img_height,
                    opacity: WATERMARK_OPACITY
                });
            }
            const pdf_bytes = await pdfDoc.save();
            fs.promises.writeFile(file_path, pdf_bytes);
            res.status(200).json({ message: `watermark added to file: ${file_id}` });
            return;
        }
        else {
            res.status(400).json({ message: 'Invalid watermark' });
            return;
        }
    } catch (error) {
        console.error('Error adding watermark:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
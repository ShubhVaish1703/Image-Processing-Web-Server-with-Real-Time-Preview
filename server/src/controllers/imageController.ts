// src/controllers/imageController.ts
import { Request, Response } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define a temporary folder to save images
const TEMP_FOLDER = path.join(__dirname, '../../temp');

// Ensure the temp folder exists
if (!fs.existsSync(TEMP_FOLDER)) {
    fs.mkdirSync(TEMP_FOLDER);
}

// Upload Image Handler
export const uploadImage = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded!' });
    }

    try {
        const imageBuffer = req.file.buffer;

        // Generate a unique filename for the uploaded image
        const filename = `${uuidv4()}.jpg`; // Default to .jpg; change if needed
        const filePath = path.join(TEMP_FOLDER, filename);

        // Save the uploaded image temporarily
        await sharp(imageBuffer).toFile(filePath);

        // Generate a low-quality preview of the uploaded image
        const preview = await sharp(imageBuffer).resize(200).jpeg({ quality: 50 }).toBuffer();

        return res.status(200).json({ message: 'Image uploaded successfully!', preview: preview.toString('base64'), filePath });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: 'Image processing failed.', error: error.message });
        } else {
            return res.status(500).json({ message: 'An unknown error occurred.' });
        }
    }
};

// Image Processing Handler (Brightness, Contrast, etc.)
export const processImage = async (req: Request, res: Response) => {
    const { brightness, contrast, saturation, rotation, crop, filePath } = req.body;

    if (!filePath || !fs.existsSync(filePath)) {
        return res.status(400).json({ message: 'Invalid or missing file path!' });
    }

    try {
        let image = sharp(filePath);

        // Apply brightness and saturation using modulate
        if (brightness || saturation) {
            image = image.modulate({
                brightness: brightness ? parseFloat(brightness) : undefined,
                saturation: saturation ? parseFloat(saturation) : undefined,
            });
        }

        // Apply contrast using linear
        if (contrast) {
            const contrastFactor = parseFloat(contrast);
            image = image.linear(contrastFactor, -(0.5 * contrastFactor) + 0.5);
        }

        // Apply rotation
        if (rotation) image = image.rotate(parseInt(rotation));

        // Apply cropping if specified
        if (crop) {
            const { width, height, left, top } = crop;
            image = image.extract({
                width: parseInt(width),
                height: parseInt(height),
                left: parseInt(left),
                top: parseInt(top),
            });
        }

        // Generate a low-quality preview
        const previewBuffer = await image.resize(200).jpeg({ quality: 50 }).toBuffer();

        // Save the processed image back to the same file path
        await image.toFile(filePath);

        return res.status(200).json({ preview: previewBuffer.toString('base64'), filePath });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: 'Image processing failed.', error: error.message });
        } else {
            return res.status(500).json({ message: 'An unknown error occurred.' });
        }
    }
};


// Download Final Image Handler
export const downloadImage = async (req: Request, res: Response) => {
    const { filePath, format = 'jpeg' } = req.query;

    if (!filePath || typeof filePath !== 'string' || !fs.existsSync(filePath)) {
        return res.status(400).json({ message: 'Invalid or missing file path!' });
    }

    try {
        const fileStream = fs.createReadStream(filePath);

        // Set the appropriate headers for downloading
        res.setHeader('Content-Disposition', `attachment; filename=processed-image.${format}`);
        res.setHeader('Content-Type', `image/${format}`);

        // Pipe the file stream to the response
        fileStream.pipe(res);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: 'Failed to download the image.', error: error.message });
        } else {
            return res.status(500).json({ message: 'An unknown error occurred.' });
        }
    }
};

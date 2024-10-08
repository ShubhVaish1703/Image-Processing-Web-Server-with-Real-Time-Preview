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
        const filename = `${uuidv4()}.jpg`;
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
    const {
        brightness = 1.0,
        contrast = 1.0,
        saturation = 1.0,
        rotation = 0,
        crop = { width: 0, height: 0, left: 0, top: 0 }, // Default crop values
        filePath
    } = req.body;

    if (!filePath || !fs.existsSync(filePath)) {
        return res.status(400).json({ message: 'Invalid or missing file path!' });
    }

    const outputFilePath = path.join(path.dirname(filePath), 'processed-image.jpg'); // Save processed image to a new file

    try {
        let image = sharp(filePath);

        // Apply brightness and saturation using modulate
        image = image.modulate({
            brightness: parseFloat(brightness),
            saturation: parseFloat(saturation),
        });

        // Apply contrast using linear
        image = image.linear(parseFloat(contrast), -(0.5 * parseFloat(contrast)) + 0.5);

        // Apply rotation
        if (rotation) {
            image = image.rotate(parseInt(rotation));
        }

        // Apply cropping if specified
        if (crop && crop.width > 0 && crop.height > 0) {
            const { width, height, left, top } = crop;
            image = image.extract({
                width: parseInt(width),
                height: parseInt(height),
                left: parseInt(left),
                top: parseInt(top),
            });
        }

        // Save the processed image to a new file
        await image.toFile(outputFilePath);

        // Generate a low-quality preview
        const previewBuffer = await image.resize(300).jpeg({ quality: 50 }).toBuffer();

        // Return the processed image preview as base64
        return res.status(200).json({
            preview: previewBuffer.toString('base64'),
            filePath: outputFilePath // Provide the path for downloading
        });
    } catch (error) {
        console.log(error);
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
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: 'Failed to download the image.', error: error.message });
        } else {
            return res.status(500).json({ message: 'An unknown error occurred.' });
        }
    }
};
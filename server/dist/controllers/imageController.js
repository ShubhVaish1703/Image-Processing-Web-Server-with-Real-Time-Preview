"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadImage = exports.processImage = exports.uploadImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
// Define a temporary folder to save images
const TEMP_FOLDER = path_1.default.join(__dirname, '../../temp');
// Ensure the temp folder exists
if (!fs_1.default.existsSync(TEMP_FOLDER)) {
    fs_1.default.mkdirSync(TEMP_FOLDER);
}
// Upload Image Handler
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded!' });
    }
    try {
        const imageBuffer = req.file.buffer;
        // Generate a unique filename for the uploaded image
        const filename = `${(0, uuid_1.v4)()}.jpg`;
        const filePath = path_1.default.join(TEMP_FOLDER, filename);
        // Save the uploaded image temporarily
        yield (0, sharp_1.default)(imageBuffer).toFile(filePath);
        // Generate a low-quality preview of the uploaded image
        const preview = yield (0, sharp_1.default)(imageBuffer).resize(200).jpeg({ quality: 50 }).toBuffer();
        return res.status(200).json({ message: 'Image uploaded successfully!', preview: preview.toString('base64'), filePath });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: 'Image processing failed.', error: error.message });
        }
        else {
            return res.status(500).json({ message: 'An unknown error occurred.' });
        }
    }
});
exports.uploadImage = uploadImage;
// Image Processing Handler (Brightness, Contrast, etc.)
const processImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { brightness = 1.0, contrast = 1.0, saturation = 1.0, rotation = 0, crop = { width: 0, height: 0, left: 0, top: 0 }, // Default crop values
    filePath } = req.body;
    if (!filePath || !fs_1.default.existsSync(filePath)) {
        return res.status(400).json({ message: 'Invalid or missing file path!' });
    }
    const outputFilePath = path_1.default.join(path_1.default.dirname(filePath), 'processed-image.jpg'); // Save processed image to a new file
    try {
        let image = (0, sharp_1.default)(filePath);
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
        yield image.toFile(outputFilePath);
        // Generate a low-quality preview
        const previewBuffer = yield image.resize(300).jpeg({ quality: 50 }).toBuffer();
        // Return the processed image preview as base64
        return res.status(200).json({
            preview: previewBuffer.toString('base64'),
            filePath: outputFilePath // Provide the path for downloading
        });
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return res.status(500).json({ message: 'Image processing failed.', error: error.message });
        }
        else {
            return res.status(500).json({ message: 'An unknown error occurred.' });
        }
    }
});
exports.processImage = processImage;
// Download Final Image Handler
const downloadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filePath, format = 'jpeg' } = req.query;
    if (!filePath || typeof filePath !== 'string' || !fs_1.default.existsSync(filePath)) {
        return res.status(400).json({ message: 'Invalid or missing file path!' });
    }
    try {
        const fileStream = fs_1.default.createReadStream(filePath);
        // Set the appropriate headers for downloading
        res.setHeader('Content-Disposition', `attachment; filename=processed-image.${format}`);
        res.setHeader('Content-Type', `image/${format}`);
        // Pipe the file stream to the response
        fileStream.pipe(res);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: 'Failed to download the image.', error: error.message });
        }
        else {
            return res.status(500).json({ message: 'An unknown error occurred.' });
        }
    }
});
exports.downloadImage = downloadImage;

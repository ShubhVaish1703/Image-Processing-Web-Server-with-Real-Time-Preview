import { Router } from 'express';
import { uploadImage, processImage, downloadImage } from '../controllers/imageController';
import { upload } from '../utils/multerConfig';

const router = Router();

// Upload image route
router.post('/upload', upload.single('image'), uploadImage);

// Process image route
router.post('/process', upload.single('image'), processImage);

// Download image route
router.get('/download', downloadImage);

export default router;

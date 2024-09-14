import { Router, Request, Response } from 'express';
import imageRoutes from './routes/imageRoutes'

const router = Router();

// Define routes under this router
router.get('/', (req: Request, res: Response) => {
    res.send('Server is live!');
});

// Routes
router.use('/images', imageRoutes);

export default router;

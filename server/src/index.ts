import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes'; // Import the routes
import './scheduler/cleanupScheduler';  // Import the cleanup scheduler

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Set a global prefix for all routes
const globalPrefix = '/api/v1';
app.use(globalPrefix, apiRoutes); // Use the routes with the global prefix

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${globalPrefix}`);
});

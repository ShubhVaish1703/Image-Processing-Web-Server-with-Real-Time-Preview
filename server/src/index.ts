import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { Server as WebSocketServer } from 'ws';
import http from 'http';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// Create an HTTP server
const server = http.createServer(app);

// Set up WebSocket server
const wss = new WebSocketServer({ server });
globalThis.wss = wss; // TypeScript declaration for global WebSocket server

wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
        console.log('Received:', message);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
});

// Enable CORS
app.use(cors());

// Set a global prefix for all routes
const globalPrefix = '/api/v1';
app.use(globalPrefix, apiRoutes); // Use the routes with the global prefix

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${globalPrefix}`);
});

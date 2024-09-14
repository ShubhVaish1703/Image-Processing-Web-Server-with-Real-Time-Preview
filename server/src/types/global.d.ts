import { Server as WebSocketServer } from 'ws';

// Extend the globalThis type
declare global {
    var wss: WebSocketServer; // Add WebSocketServer type to globalThis
}
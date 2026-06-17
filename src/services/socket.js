import { io } from 'socket.io-client';

// Use explicit backend URL in development to avoid proxy-related ECONNREFUSED from vite dev proxy.
const devBackend = 'http://localhost:3001';
const backendUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? devBackend : undefined);

const socket = io(backendUrl || undefined, {
  autoConnect: false,
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
});

export default socket;

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

// Log de connexion pour debug
socket.on('connect', () => {
  console.log('✅ Connecté au serveur Socket.io');
});

socket.on('disconnect', () => {
  console.log('❌ Déconnecté du serveur Socket.io');
});

socket.on('connect_error', (error) => {
  console.error('❌ Erreur de connexion Socket.io:', error);
});

export default socket;

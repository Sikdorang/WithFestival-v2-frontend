import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('Socket.IO connection established');
});

socket.on('disconnect', () => {
  console.log('Socket.IO connection closed');
});

socket.on('error', (error: unknown) => {
  console.error('Socket.IO error:', error);
});

socket.on('joinedRoom', (data) => {
  console.log('🏠 방 입장:', data);
});

socket.onAny((eventName, ...args) => {
  console.log(`📩 이벤트 수신 [${eventName}]:`, args);
});

setTimeout(() => {
  console.log('연결 상태:', socket.connected);
  console.log('소켓 ID:', socket.id);
}, 5000);

export default socket;

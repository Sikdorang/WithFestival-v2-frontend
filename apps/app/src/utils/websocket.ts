import { io, Socket } from 'socket.io-client';

class WebSocketManager {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private lastRefreshTime: number = 0;
  private readonly refreshCooldown: number = 2000;

  connect(accessToken?: string, storeId?: number) {
    if (this.socket) {
      console.log('⚠️ 이미 소켓이 연결되어 있습니다.');
      return;
    }

    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL || 'https://app.withfestival.site';

    console.log('🚀 WebSocket 연결 시작...', {
      storeId,
      hasToken: !!accessToken,
    });

    this.socket = io(SOCKET_URL, {
      path: '/socket.io',
      // 💡 백엔드 가이드: 토큰이 있으면 token, 없으면 boothId로 인증
      auth: accessToken ? { token: accessToken } : { boothId: storeId },
      transports: ['websocket'], // 💡 중요: 오직 웹소켓만 사용 (Polling 차단)
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ WebSocket 연결 성공! ID:', this.socket?.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket 연결 해제:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ 소켓 연결 오류:', error.message);
    });

    // 1. 주문 관련
    this.socket.on('order.created', (payload) => {
      console.log('🔔 새 주문 생성:', payload);
      this.refreshScreen();
    });

    this.socket.on('order.payment.paid', (payload) => {
      console.log('💰 결제 완료:', payload);
      this.refreshScreen();
    });

    this.socket.on('order.status.completed', (payload) => {
      console.log('🏁 주문 완료:', payload);
      this.refreshScreen();
    });

    // 2. 웨이팅 관련
    this.socket.on('waiting.created', (payload) => {
      console.log('🚶 새 웨이팅:', payload);
      this.refreshScreen();
    });

    this.socket.on('waiting.status.entered', (payload) => {
      console.log('✅ 웨이팅 입장:', payload);
      this.refreshScreen();
    });

    // 3. 예약 관련
    this.socket.on('reservation.created', (payload) => {
      console.log('📅 새 예약:', payload);
      this.refreshScreen();
    });

    // 모든 이벤트 로깅 (디버깅용)
    this.socket.onAny((eventName, ...args) => {
      console.log(`📩 [EVENT]: ${eventName}`, args);
    });
  }

  private refreshScreen() {
    const now = Date.now();
    if (now - this.lastRefreshTime < this.refreshCooldown) return;

    this.lastRefreshTime = now;

    window.location.reload();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

const websocketManager = new WebSocketManager();
export default websocketManager;

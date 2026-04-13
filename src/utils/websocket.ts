import { io, Socket } from 'socket.io-client';

class WebSocketManager {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private lastRefreshTime: number = 0;
  private readonly refreshCooldown: number = 2000; // 2초 쿨다운
  private currentUserId: number | null = null;

  connect(userId?: number) {
    if (this.socket) {
      return;
    }

    this.currentUserId = userId || null;
    console.log(
      '🚀 WebSocket 연결 시작...',
      userId ? `사용자 ID: ${userId}` : '',
    );

    this.socket = io('http://localhost:4000', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // 연결 상태
    this.socket.on('connect', () => {
      console.log('✅ WebSocket 연결됨, ID:', this.socket?.id);
      this.isConnected = true;

      // 사용자 ID가 있으면 해당 사용자의 방에 입장
      if (this.currentUserId) {
        const roomId = `user_${this.currentUserId}`;
        console.log(`🏠 방 입장 시도: ${roomId}`);
        this.socket?.emit('joinRoom', { roomId });
      } else {
        console.log('⚠️ 사용자 ID가 없어서 방 입장을 건너뜁니다.');
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket 연결 해제:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.log('❌ 연결 오류:', error.message);
    });

    // 방 입장 확인
    this.socket.on('joinedRoom', (data) => {
      console.log('🏠 방 입장:', data);
    });

    // 주문 관련 이벤트
    this.socket.on('orderReceived', (data) => {
      console.log('📦 주문 수신:', data);
      this.refreshScreen();
    });

    this.socket.on('orderCreated', (data) => {
      console.log('🆕 주문 생성:', data);
      this.refreshScreen();
    });

    this.socket.on('orderSendUpdated', (data) => {
      console.log('💰 주문 송금 완료:', data);
      this.refreshScreen();
    });

    this.socket.on('orderCookedUpdated', (data) => {
      console.log('🍳 주문 조리 완료:', data);
      this.refreshScreen();
    });

    this.socket.on('orderDeleted', (data) => {
      console.log('🗑️ 주문 삭제:', data);
      this.refreshScreen();
    });

    // 대기 관련 이벤트
    this.socket.on('waitingReceived', (data) => {
      console.log('⏳ 대기 수신:', data);
      this.refreshScreen();
    });

    this.socket.on('waitingCreated', (data) => {
      console.log('➕ 대기 생성:', data);
      this.refreshScreen();
    });

    this.socket.on('waitingProcessed', (data) => {
      console.log('✅ 대기 처리:', data);
      this.refreshScreen();
    });

    // 화면 새로고침 이벤트
    this.socket.on('refreshScreen', () => {
      console.log('🔄 화면 새로고침 이벤트!');
      this.refreshScreen();
    });

    // 모든 이벤트 로깅
    this.socket.onAny((eventName, ...args) => {
      console.log(`📩 이벤트 수신 [${eventName}]:`, args);
    });
  }

  private refreshScreen() {
    const now = Date.now();

    // 쿨다운 체크
    if (now - this.lastRefreshTime < this.refreshCooldown) {
      console.log('⏰ 새로고침 쿨다운 중...');
      return;
    }

    console.log('🔄 화면 새로고침 실행');
    this.lastRefreshTime = now;

    // 페이지 새로고침
    window.location.reload();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id,
    };
  }
}

// 싱글톤 인스턴스 생성
const websocketManager = new WebSocketManager();

export default websocketManager;

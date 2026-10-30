/**
 * In-memory fixture data for `pnpm --filter app dev:mock`.
 * Mutations from the mock handlers write here, so the UI reflects changes
 * until the page is reloaded.
 */

export const MOCK_STORE_ID = 1;
export const MOCK_TABLE_ID = 3;

const now = new Date();
const minutesAgo = (m: number) =>
  new Date(now.getTime() - m * 60_000).toISOString();
const hhmm = (m: number) =>
  new Date(now.getTime() - m * 60_000).toTimeString().slice(0, 5);

export const db = {
  store: {
    id: MOCK_STORE_ID,
    name: '목업 주점',
    accountNumber: '국민 123456-78-901234 홍길동',
    notice: '목업 모드입니다. 실제 API에 연결되지 않습니다.',
    noticeEn: 'Mock mode — not connected to the real API.',
    noticeZh: '模拟模式 — 未连接真实 API。',
    noticeJa: 'モックモード — 実際の API には接続されていません。',
    event: '2잔 주문 시 안주 10% 할인',
    reservationEnabled: true,
    missionsEnabled: true,
    waitingsEnabled: true,
    createdAt: minutesAgo(60 * 24 * 7),
  },

  menus: [
    {
      id: 1,
      name: '김치전',
      price: 12000,
      description: '바삭한 김치전',
      imageUrl: '',
      marginRate: 40,
      isSoldOut: false,
    },
    {
      id: 2,
      name: '닭꼬치',
      price: 8000,
      description: '데리야끼 소스',
      imageUrl: '',
      marginRate: 35,
      isSoldOut: false,
    },
    {
      id: 3,
      name: '어묵탕',
      price: 15000,
      description: '따끈한 국물',
      imageUrl: '',
      marginRate: 50,
      isSoldOut: true,
    },
    {
      id: 4,
      name: '콜라',
      price: 2000,
      description: '',
      imageUrl: '',
      marginRate: 60,
      isSoldOut: false,
    },
  ],

  orders: [
    {
      id: 101,
      storeId: MOCK_STORE_ID,
      tableId: 3,
      totalPrice: 20000,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      customerName: '김철수',
      phoneNumber: '010-1234-5678',
      createdAt: minutesAgo(12),
      updatedAt: minutesAgo(12),
      items: [
        {
          id: 1001,
          orderId: 101,
          menuId: 1,
          quantity: 1,
          price: 12000,
          completed: false,
          menu: { id: 1, name: '김치전' },
        },
        {
          id: 1002,
          orderId: 101,
          menuId: 2,
          quantity: 1,
          price: 8000,
          completed: true,
          menu: { id: 2, name: '닭꼬치' },
        },
      ],
    },
    {
      id: 102,
      storeId: MOCK_STORE_ID,
      tableId: 7,
      totalPrice: 34000,
      status: 'PENDING',
      paymentStatus: 'PAID',
      customerName: '이영희',
      phoneNumber: '010-9876-5432',
      createdAt: minutesAgo(5),
      updatedAt: minutesAgo(3),
      items: [
        {
          id: 1003,
          orderId: 102,
          menuId: 3,
          quantity: 2,
          price: 15000,
          completed: false,
          menu: { id: 3, name: '어묵탕' },
        },
        {
          id: 1004,
          orderId: 102,
          menuId: 4,
          quantity: 2,
          price: 2000,
          completed: false,
          menu: { id: 4, name: '콜라' },
        },
      ],
    },
    {
      id: 103,
      storeId: MOCK_STORE_ID,
      tableId: 2,
      totalPrice: 24000,
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      customerName: '박민수',
      phoneNumber: '010-5555-1111',
      createdAt: minutesAgo(90),
      updatedAt: minutesAgo(70),
      items: [
        {
          id: 1005,
          orderId: 103,
          menuId: 1,
          quantity: 2,
          price: 12000,
          completed: true,
          menu: { id: 1, name: '김치전' },
        },
      ],
    },
  ],

  waitings: [
    {
      id: 1,
      name: '최지우',
      phoneNumber: '010-1111-2222',
      partySize: 3,
      time: hhmm(20),
      processed: false,
      userId: MOCK_STORE_ID,
      status: 'WAITING',
    },
    {
      id: 2,
      name: '정우성',
      phoneNumber: '010-3333-4444',
      partySize: 2,
      time: hhmm(8),
      processed: false,
      userId: MOCK_STORE_ID,
      status: 'WAITING',
    },
  ],

  reservationSlots: [
    {
      id: 1,
      storeId: MOCK_STORE_ID,
      startTime: '18:00',
      endTime: '19:00',
      availableTables: 5,
      createdAt: minutesAgo(600),
      updatedAt: minutesAgo(600),
      reservedTeamCount: 1,
    },
    {
      id: 2,
      storeId: MOCK_STORE_ID,
      startTime: '19:00',
      endTime: '20:00',
      availableTables: 5,
      createdAt: minutesAgo(600),
      updatedAt: minutesAgo(600),
      reservedTeamCount: 0,
    },
  ],

  reservations: [
    {
      id: 1,
      reservationSlotId: 1,
      reserverName: '한가인',
      phoneNumber: '010-7777-8888',
      partySize: 4,
      deleted: false,
      createdAt: minutesAgo(120),
      updatedAt: minutesAgo(120),
    },
  ],

  missions: [
    {
      id: 1,
      storeId: MOCK_STORE_ID,
      missionName: '인증샷 올리기',
      description: '부스 사진을 SNS에 올려주세요',
      reward: '음료 1잔',
      isActive: true,
      createdAt: minutesAgo(300),
      updatedAt: minutesAgo(300),
    },
    {
      id: 2,
      storeId: MOCK_STORE_ID,
      missionName: '가위바위보 3연승',
      description: '',
      reward: '안주 할인',
      isActive: false,
      createdAt: minutesAgo(200),
      updatedAt: minutesAgo(200),
    },
  ],

  coupons: [
    {
      id: 1,
      code: 'WELCOME10',
      type: 'PERCENT',
      discountPrice: 10,
      holder: null,
      used: false,
    },
    {
      id: 2,
      code: 'FREE2000',
      type: 'AMOUNT',
      discountPrice: 2000,
      holder: '김철수',
      used: true,
    },
  ],

  messages: [
    {
      id: 1,
      message: '물티슈 부탁드려요',
      tableNumber: '3',
      time: hhmm(4),
      check: false,
    },
  ],

  blindDates: [
    {
      id: 1,
      name: '홍길동',
      age: 23,
      contact: '@gildong',
      mbti: 'ENFP',
      appearanceStyle: 2,
      gender: 'MALE',
      numberDelivered: false,
      deliveryPhone: '010-0000-0000',
      createdAt: minutesAgo(30),
      updatedAt: minutesAgo(30),
    },
  ],

  tableLikes: [
    {
      storeId: MOCK_STORE_ID,
      tableId: 3,
      totalLikeCount: 4,
      likes: [{ nickname: '불꽃', likeCount: 4 }],
    },
    {
      storeId: MOCK_STORE_ID,
      tableId: 7,
      totalLikeCount: 1,
      likes: [{ nickname: '별빛', likeCount: 1 }],
    },
  ],
};

let seq = 10_000;
export const nextId = () => ++seq;

import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { db, MOCK_STORE_ID, nextId } from './db';

type Reply = [number, unknown?];

const body = (config: AxiosRequestConfig): Record<string, any> => {
  if (config.data instanceof FormData) {
    return Object.fromEntries(config.data.entries());
  }
  try {
    return config.data ? JSON.parse(config.data) : {};
  } catch {
    return {};
  }
};

/** Pulls the first numeric path segment captured by `(\d+)` in a route. */
const idFrom = (config: AxiosRequestConfig, route: RegExp) =>
  Number(config.url?.match(route)?.[1]);

const notFound: Reply = [404, { message: '목업 데이터에 없는 항목입니다.' }];

const findOrder = (id: number) => db.orders.find((o) => o.id === id);

export function registerMockHandlers(instance: AxiosInstance) {
  const mock = new MockAdapter(instance, { delayResponse: 250 });

  // ---------- auth ----------
  mock
    .onPost(/\/auth\/login$/)
    .reply(() => [200, { accessToken: 'mock-token' }]);
  mock.onGet(/\/auth\/userId$/).reply(() => [200, { userId: MOCK_STORE_ID }]);

  // ---------- logs ----------
  mock.onPost(/\/logs$/).reply(() => [201]);

  // ---------- store ----------
  mock.onGet(/\/stores\/me\/info$/).reply(() => [200, db.store]);
  mock.onGet(/\/stores\/\d+\/info$/).reply(() => [200, db.store]);
  mock.onPatch(/\/stores\/account-number$/).reply((c) => {
    db.store.accountNumber = body(c).accountNumber;
    return [200, db.store];
  });
  mock
    .onPatch(
      /\/stores\/(name|notice|event|reservation-enabled|missions-enabled|waitings-enabled)$/,
    )
    .reply((c) => {
      Object.assign(db.store, body(c));
      return [200, db.store];
    });

  // ---------- menus ----------
  mock.onGet(/\/menus$/).reply(() => [200, db.menus]);
  mock.onGet(/\/stores\/\d+\/menus$/).reply(() => [200, db.menus]);
  mock.onPost(/\/menus$/).reply((c) => {
    const b = body(c);
    const menu = {
      id: nextId(),
      name: String(b.name ?? ''),
      price: Number(b.price ?? 0),
      description: String(b.description ?? ''),
      imageUrl: '',
      marginRate: Number(b.marginRate ?? 0),
      isSoldOut: false,
    };
    db.menus.push(menu);
    return [201, menu];
  });
  mock.onPost(/\/menus\/(\d+)\/(sold-out|available)$/).reply((c) => {
    const menu = db.menus.find((m) => m.id === idFrom(c, /\/menus\/(\d+)/));
    if (!menu) return notFound;
    menu.isSoldOut = c.url!.endsWith('sold-out');
    return [200, menu];
  });
  mock.onPatch(/\/menus\/(\d+)$/).reply((c) => {
    const menu = db.menus.find((m) => m.id === idFrom(c, /\/menus\/(\d+)$/));
    if (!menu) return notFound;
    const b = body(c);
    Object.assign(menu, {
      ...(b.name !== undefined && { name: String(b.name) }),
      ...(b.price !== undefined && { price: Number(b.price) }),
      ...(b.description !== undefined && {
        description: String(b.description),
      }),
      ...(b.marginRate !== undefined && { marginRate: Number(b.marginRate) }),
    });
    return [200, menu];
  });
  mock.onDelete(/\/menus\/(\d+)$/).reply((c) => {
    const id = idFrom(c, /\/menus\/(\d+)$/);
    db.menus = db.menus.filter((m) => m.id !== id);
    return [200];
  });
  mock.onDelete(/\/menu\/\d+\/image$/).reply(() => [200]);
  mock.onPatch(/\/menu\/\d+\/image$/).reply(() => [200, { url: '' }]);

  // ---------- orders ----------
  mock
    .onGet(/\/orders\/all$/)
    .reply(() => [200, { data: db.orders, count: db.orders.length }]);
  mock.onGet(/\/orders$/).reply((c) => {
    const paid = String(c.params?.paid) === 'true';
    const data = db.orders.filter((o) =>
      paid ? o.status !== 'PENDING' : o.status === 'PENDING',
    );
    return [200, { data, count: data.length }];
  });
  mock.onPost(/\/orders$/).reply((c) => {
    const b = body(c);
    const id = nextId();
    const order = {
      id,
      storeId: b.storeId ?? MOCK_STORE_ID,
      tableId: b.tableId ?? 0,
      totalPrice: b.totalPrice ?? 0,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      customerName: b.depositorName ?? '',
      phoneNumber: b.phoneNumber ?? '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: (b.items ?? []).map(
        (i: { menuId: number; price: number; quantity: number }) => {
          const menu = db.menus.find((m) => m.id === i.menuId);
          return {
            id: nextId(),
            orderId: id,
            menuId: i.menuId,
            quantity: i.quantity,
            price: i.price,
            completed: false,
            menu: { id: i.menuId, name: menu?.name ?? `메뉴 ${i.menuId}` },
          };
        },
      ),
    };
    db.orders.unshift(order);
    return [201, order];
  });
  mock.onPatch(/\/orders\/items\/(\d+)\/toggle-completed$/).reply((c) => {
    const itemId = idFrom(c, /\/items\/(\d+)\//);
    const item = db.orders.flatMap((o) => o.items).find((i) => i.id === itemId);
    if (!item) return notFound;
    item.completed = !item.completed;
    return [200, item];
  });
  mock.onPatch(/\/orders\/(\d+)\/payment\/(paid|failed)$/).reply((c) => {
    const order = findOrder(idFrom(c, /\/orders\/(\d+)\//));
    if (!order) return notFound;
    order.paymentStatus = c.url!.endsWith('paid') ? 'PAID' : 'FAILED';
    return [200, order];
  });
  mock.onPatch(/\/orders\/(\d+)\/status\/(cancelled|completed)$/).reply((c) => {
    const order = findOrder(idFrom(c, /\/orders\/(\d+)\//));
    if (!order) return notFound;
    order.status = c.url!.endsWith('completed') ? 'COMPLETED' : 'CANCELED';
    return [200, order];
  });

  // ---------- waitings ----------
  const activeWaitings = () =>
    db.waitings.filter((w) => w.status === 'WAITING');
  mock
    .onGet(/\/stores\/\d+\/waitings\/active-count$/)
    .reply(() => [200, { count: activeWaitings().length }]);
  mock.onPost(/\/stores\/\d+\/waitings$/).reply((c) => {
    const b = body(c);
    const waiting = {
      id: nextId(),
      name: b.name,
      phoneNumber: b.phoneNumber,
      partySize: b.partySize,
      time: new Date().toTimeString().slice(0, 5),
      processed: false,
      userId: MOCK_STORE_ID,
      status: 'WAITING',
    };
    db.waitings.push(waiting);
    return [201, waiting];
  });
  mock.onGet(/\/waitings$/).reply(() => [200, activeWaitings()]);
  mock.onPatch(/\/waitings\/(\d+)$/).reply((c) => {
    const waiting = db.waitings.find(
      (w) => w.id === idFrom(c, /\/waitings\/(\d+)$/),
    );
    if (!waiting) return notFound;
    waiting.status = body(c).status;
    waiting.processed = true;
    return [200, waiting];
  });

  // ---------- reservations ----------
  const slotWithCount = (slot: (typeof db.reservationSlots)[number]) => ({
    ...slot,
    reservedTeamCount: db.reservations.filter(
      (r) => r.reservationSlotId === slot.id && !r.deleted,
    ).length,
  });
  const createReservation = (c: AxiosRequestConfig): Reply => {
    const b = body(c);
    const reservation = {
      id: nextId(),
      reservationSlotId: Number(b.reservationSlotId),
      reserverName: b.reserverName,
      phoneNumber: b.phoneNumber,
      partySize: Number(b.partySize),
      deleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.reservations.push(reservation);
    return [201, reservation];
  };
  mock
    .onGet(/\/stores\/\d+\/reservation-slots$/)
    .reply(() => [200, db.reservationSlots.map(slotWithCount)]);
  mock.onPost(/\/stores\/\d+\/reservations$/).reply(createReservation);
  mock.onGet(/\/reservation-slots\/(\d+)\/reservations$/).reply((c) => {
    const slotId = idFrom(c, /\/reservation-slots\/(\d+)\//);
    return [
      200,
      db.reservations.filter(
        (r) => r.reservationSlotId === slotId && !r.deleted,
      ),
    ];
  });
  mock
    .onGet(/\/reservation-slots$/)
    .reply(() => [200, db.reservationSlots.map(slotWithCount)]);
  mock.onPost(/\/reservation-slots$/).reply((c) => {
    const slot = {
      id: nextId(),
      storeId: MOCK_STORE_ID,
      ...(body(c) as {
        startTime: string;
        endTime: string;
        availableTables: number;
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reservedTeamCount: 0,
    };
    db.reservationSlots.push(slot);
    return [201, slot];
  });
  mock.onPatch(/\/reservation-slots\/(\d+)$/).reply((c) => {
    const slot = db.reservationSlots.find(
      (s) => s.id === idFrom(c, /\/reservation-slots\/(\d+)$/),
    );
    if (!slot) return notFound;
    Object.assign(slot, body(c));
    return [200, slot];
  });
  mock.onDelete(/\/reservation-slots\/(\d+)$/).reply((c) => {
    const id = idFrom(c, /\/reservation-slots\/(\d+)$/);
    db.reservationSlots = db.reservationSlots.filter((s) => s.id !== id);
    return [200];
  });
  mock.onGet(/\/reservations\/(\d+)$/).reply((c) => {
    const r = db.reservations.find(
      (x) => x.id === idFrom(c, /\/reservations\/(\d+)$/),
    );
    return r ? [200, r] : notFound;
  });
  mock.onDelete(/\/reservations\/(\d+)$/).reply((c) => {
    const r = db.reservations.find(
      (x) => x.id === idFrom(c, /\/reservations\/(\d+)$/),
    );
    if (!r) return notFound;
    r.deleted = true;
    return [200];
  });
  mock.onPost(/\/reservations$/).reply(createReservation);

  // ---------- missions ----------
  mock.onGet(/\/stores\/\d+\/missions$/).reply(() => [200, db.missions]);
  mock.onGet(/\/missions$/).reply(() => [200, db.missions]);
  // useMission reads `response.data` for single-mission endpoints.
  mock.onGet(/\/missions\/(\d+)$/).reply((c) => {
    const m = db.missions.find((x) => x.id === idFrom(c, /\/missions\/(\d+)$/));
    return m ? [200, { data: m }] : notFound;
  });
  mock.onPost(/\/missions$/).reply((c) => {
    const mission = {
      id: nextId(),
      storeId: MOCK_STORE_ID,
      ...(body(c) as {
        missionName: string;
        description: string;
        reward: string;
      }),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.missions.push(mission);
    return [201, { data: mission }];
  });
  mock.onPatch(/\/missions\/(\d+)\/active$/).reply((c) => {
    const m = db.missions.find(
      (x) => x.id === idFrom(c, /\/missions\/(\d+)\//),
    );
    if (!m) return notFound;
    m.isActive = Boolean(body(c).isActive);
    return [200, m];
  });
  mock.onPatch(/\/missions\/(\d+)$/).reply((c) => {
    const m = db.missions.find((x) => x.id === idFrom(c, /\/missions\/(\d+)$/));
    if (!m) return notFound;
    Object.assign(m, body(c));
    return [200, { data: m }];
  });
  mock.onDelete(/\/missions\/(\d+)$/).reply((c) => {
    const id = idFrom(c, /\/missions\/(\d+)$/);
    db.missions = db.missions.filter((m) => m.id !== id);
    return [200];
  });

  // ---------- coupons ----------
  mock.onPost(/\/stores\/\d+\/coupons\/validate$/).reply((c) => {
    const coupon = db.coupons.find((x) => x.code === body(c).code && !x.used);
    return coupon
      ? [200, coupon]
      : [400, { message: '유효하지 않은 쿠폰입니다.' }];
  });
  mock.onGet(/\/coupons$/).reply(() => [200, db.coupons]);
  mock.onPost(/\/coupons$/).reply((c) => {
    const coupon = {
      id: nextId(),
      holder: null,
      used: false,
      ...body(c),
    } as (typeof db.coupons)[number];
    db.coupons.push(coupon);
    return [201, coupon];
  });
  mock.onPatch(/\/coupons\/(\d+)\/(used|holder)$/).reply((c) => {
    const coupon = db.coupons.find(
      (x) => x.id === idFrom(c, /\/coupons\/(\d+)\//),
    );
    if (!coupon) return notFound;
    Object.assign(coupon, body(c));
    return [200, coupon];
  });
  mock.onDelete(/\/coupons\/(\d+)$/).reply((c) => {
    const id = idFrom(c, /\/coupons\/(\d+)$/);
    db.coupons = db.coupons.filter((x) => x.id !== id);
    return [200];
  });

  // ---------- messages ----------
  mock.onGet(/\/message$/).reply(() => [200, db.messages]);
  mock.onPost(/\/message$/).reply((c) => {
    const b = body(c);
    const message = {
      id: nextId(),
      message: b.message,
      tableNumber: String(b.tableNumber),
      time: new Date().toTimeString().slice(0, 5),
      check: false,
    };
    db.messages.push(message);
    return [201, message];
  });
  mock.onPatch(/\/message\/(\d+)\/check$/).reply((c) => {
    const m = db.messages.find((x) => x.id === idFrom(c, /\/message\/(\d+)\//));
    if (!m) return notFound;
    m.check = true;
    return [200, m];
  });

  // ---------- blind dates ----------
  mock.onGet(/\/blind-dates$/).reply(() => [200, db.blindDates]);
  mock.onPost(/\/blind-dates$/).reply((c) => {
    const entry = {
      id: nextId(),
      ...(body(c) as Omit<
        (typeof db.blindDates)[number],
        'id' | 'numberDelivered' | 'createdAt' | 'updatedAt'
      >),
      numberDelivered: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.blindDates.unshift(entry);
    return [201, entry];
  });

  // ---------- love alarm ----------
  mock.onGet(/\/stores\/\d+\/table-likes$/).reply(() => [200, db.tableLikes]);
  mock
    .onGet(/\/table-likes\/me$/)
    .reply(() => [
      200,
      {
        id: 1,
        storeId: MOCK_STORE_ID,
        tableId: 3,
        nickname: '불꽃',
        likeCount: 4,
        tokenUuid: 'mock',
        createdAt: '',
        updatedAt: '',
      },
    ]);
  mock.onPost(/\/table-likes(\/nickname)?$/).reply((c) => {
    const b = body(c);
    let table = db.tableLikes.find((t) => t.tableId === b.tableId);
    if (!table) {
      table = {
        storeId: MOCK_STORE_ID,
        tableId: b.tableId,
        totalLikeCount: 0,
        likes: [],
      };
      db.tableLikes.push(table);
    }
    const isLike = !c.url!.endsWith('/nickname');
    if (isLike) table.totalLikeCount += 1;
    return [
      200,
      {
        id: nextId(),
        storeId: MOCK_STORE_ID,
        tableId: b.tableId,
        nickname: b.nickname,
        likeCount: table.totalLikeCount,
        tokenUuid: b.tokenUuid ?? 'mock',
        createdAt: '',
        updatedAt: '',
      },
    ];
  });

  // Anything not covered above: fail loudly so missing handlers are obvious.
  mock.onAny().reply((c) => {
    console.warn(`[mock api] 핸들러 없음: ${c.method?.toUpperCase()} ${c.url}`);
    return [
      501,
      {
        message: `목업 핸들러가 없습니다: ${c.method?.toUpperCase()} ${c.url}`,
      },
    ];
  });

  return mock;
}

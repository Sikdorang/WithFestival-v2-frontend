'use client';

import { KEYS } from '@/constants/storage';
import { SocketContext } from '@/contexts/useSocket';
import { env } from '@/shared/config/env';
import { useAuthStore } from '@/stores/authStore';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = env.VITE_SOCKET_URL || 'https://app.withfestival.site';

interface Props {
  children: React.ReactNode;
}

export function SocketProvider({ children }: Props) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const accessToken = sessionStorage.getItem(KEYS.ACCESS_TOKEN);

    if (user) {
      const newSocket = io(SOCKET_URL, {
        path: '/socket.io',
        transports: ['websocket'],
        auth: accessToken ? { token: accessToken } : { boothId: user?.id },
      });

      newSocket.on('connect_error', () => {
        // Intentionally quiet — avoid leaking auth context to the console.
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

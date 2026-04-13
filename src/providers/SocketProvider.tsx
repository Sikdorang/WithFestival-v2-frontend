import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketContext } from '@/contexts/useSocket';
import { useAuthStore } from '@/stores/authStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

interface Props {
  children: React.ReactNode;
}

export function SocketProvider({ children }: Props) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
        query: {
          room: `user-${user.id}`,
        },
      });
      newSocket.on('connect', () => {});
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

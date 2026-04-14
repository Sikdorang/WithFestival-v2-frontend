import { ROUTES } from '@/constants/routes';
import { useSocket } from '@/contexts/useSocket';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { BottomBar } from './BottomBar';

export function TabBarLayout() {
  const notification = new Audio('/sounds/effect_notification.mp3');
  const socket = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  const currentOutlet = useOutlet();

  const [hasNewWaiting, setHasNewWaiting] = useState(false);
  const [hasNewOrder, setHasNewOrder] = useState(false);

  const getActiveTab = () => {
    switch (location.pathname) {
      case ROUTES.MANAGE_WAITING:
        return 'timer';
      case ROUTES.ORDER:
        return 'food';
      case ROUTES.STORE:
        return 'settings';
      case ROUTES.HISTORY:
        return 'history';
      default:
        return 'timer';
    }
  };

  const handleTabClick = (
    tabName: 'timer' | 'settings' | 'food' | 'history',
  ) => {
    if (tabName === 'timer') {
      setHasNewWaiting(false);
      setHasNewOrder(false);
    }

    switch (tabName) {
      case 'timer':
        navigate(ROUTES.MANAGE_WAITING);
        break;
      case 'settings':
        navigate(ROUTES.STORE);
        break;
      case 'food':
        navigate(ROUTES.ORDER);
        break;
      case 'history':
        navigate(ROUTES.HISTORY);
        break;
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleOrderCreated = () => {
      toast.success('새 주문이 들어왔어요 !');
      notification.play();
      setHasNewOrder(true);
    };

    const handleWaitingCreated = () => {
      setHasNewWaiting(true);
    };

    socket.on('orderCreated', handleOrderCreated);
    socket.on('waitingCreated', handleWaitingCreated);

    return () => {
      socket.off('orderCreated', handleOrderCreated);
      socket.off('waitingCreated', handleWaitingCreated);
    };
  }, [socket]);

  return (
    <>
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: 1,
              y: 0,
              transitionEnd: { transform: 'none' },
            }}
            exit={{ opacity: 0, y: -15 }}
            transition={{
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {currentOutlet}
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomBar
        activeTab={getActiveTab()}
        onTabClick={handleTabClick}
        hasNewWaiting={hasNewWaiting}
        hasNewOrder={hasNewOrder}
      />
    </>
  );
}

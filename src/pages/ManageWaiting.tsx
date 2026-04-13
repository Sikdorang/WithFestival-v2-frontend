import EmptyImage from '@/assets/icons/ic_empty_waiting.svg?react';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import { WaitingCard } from '@/components/pages/manageWaiting/WaitingCard';
import { useEffect } from 'react';
import { useWaiting } from '../hooks/useWaiting';
import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import TopBar from '@/components/pages/waiting/TopBar';
import { useSocket } from '@/contexts/useSocket';

export default function ManageWaiting() {
  const socket = useSocket();
  const { waitingList, fetchWaiting, setWaitingProcessed } = useWaiting();

  useEffect(() => {
    fetchWaiting();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchWaiting();
    };
    if (socket) {
      socket.on('waitingProcessed', handleRefresh);
      socket.on('waitingCreated', handleRefresh);
    }
    return () => {
      if (socket) {
        socket.off('waitingProcessed', handleRefresh);
        socket.off('waitingCreated', handleRefresh);
      }
    };
  }, [socket]);

  return (
    <div>
      <TopBar title="현재 웨이팅" value={waitingList.length} />

      <main className="flex min-h-screen flex-col gap-4 bg-gray-500-5 p-4">
        {waitingList.length === 0 ? (
          <EmptyPlaceHolder
            image={<EmptyImage color="white" />}
            text="웨이팅이 없습니다."
          />
        ) : (
          <>
            {waitingList.map((item) => (
              <WaitingCard
                key={item.id}
                waitingInfo={item}
                setWaitingProcessed={setWaitingProcessed}
              />
            ))}
          </>
        )}

        <BottomSpace />
      </main>
    </div>
  );
}

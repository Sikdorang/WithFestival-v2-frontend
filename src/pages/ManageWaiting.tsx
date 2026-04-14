import EmptyImage from '@/assets/icons/ic_empty_waiting.svg?react';
import BottomSpace from '@/components/common/exceptions/BottomSpace';
import EmptyPlaceHolder from '@/components/common/exceptions/EmptyPlaceHolder';
import { WaitingCard } from '@/components/pages/manageWaiting/WaitingCard';
import WaitingTopBar from '@/components/pages/waiting/WaitingTopBar';
import { useSocket } from '@/contexts/useSocket';
import { useEffect } from 'react';
import { useWaiting } from '../hooks/useWaiting';

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
      <WaitingTopBar title="현재 웨이팅" value={waitingList.length} />

      <main className="bg-gray-500-5 flex min-h-screen flex-col gap-4 p-4">
        {waitingList.length === 0 ? (
          <div className="flex min-h-[90vh] items-center justify-center pb-20">
            <EmptyPlaceHolder
              image={<EmptyImage color="white" />}
              text="웨이팅이 없습니다."
            />
          </div>
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

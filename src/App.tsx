import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary';
import Router from './routes/index.tsx';
import { SocketProvider } from './providers/SocketProvider.tsx';
import { useEffect, useState } from 'react';
import { useAuthStore } from './stores/authStore.ts';
import BaseResponsiveLayout from './components/common/layouts/BaseResponsiveLayout.tsx';
import LoadingView from './components/common/exceptions/LoadingView.tsx';

export default function App() {
  const queryClient = new QueryClient();
  const { checkAuthStatus } = useAuthStore();
  const [isInitializing, setIsInitializing] = useState(true);
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkAuthStatus();
      } finally {
        setIsInitializing(false);
      }
    };
    initializeApp();
  }, [checkAuthStatus]);

  if (isInitializing) {
    return (
      <BaseResponsiveLayout>
        <div className="flex h-screen items-center justify-center">
          <LoadingView />
        </div>
      </BaseResponsiveLayout>
    );
  }

  return (
    <GlobalErrorBoundary>
      <SocketProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster
            containerStyle={{
              bottom: '7rem',
            }}
            position="bottom-center"
          />
          <Router />
        </QueryClientProvider>
      </SocketProvider>
    </GlobalErrorBoundary>
  );
}

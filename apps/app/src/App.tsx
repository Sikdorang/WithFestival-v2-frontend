import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import LoadingView from './components/common/exceptions/LoadingView.tsx';
import GlobalErrorBoundary from './components/common/GlobalErrorBoundary';
import BaseResponsiveLayout from './components/common/layouts/BaseResponsiveLayout.tsx';
import { useGlobalLogger } from './hooks/common/useGlobalLogger';
import { SocketProvider } from './providers/SocketProvider.tsx';
import Router from './routes/index.tsx';
import { useAuthStore } from './stores/authStore.ts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  useGlobalLogger();

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

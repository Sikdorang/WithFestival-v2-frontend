import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';

type Options = Omit<RenderOptions, 'wrapper'> & {
  route?: string;
  routerProps?: MemoryRouterProps;
};

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', routerProps, ...options }: Options = {},
) {
  const queryClient = createTestQueryClient();
  const initialEntries = routerProps?.initialEntries ?? [route];

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries} {...routerProps}>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    );
  }

  return {
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...options }),
  };
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

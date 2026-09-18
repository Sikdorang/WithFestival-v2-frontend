import * as Sentry from '@sentry/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { env } from './shared/config/env';
import './i18n';
import './index.css';

const sentryDsn = env.VITE_SENTRY_DSN;

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.2,
    sendDefaultPii: false,
    beforeSend(event) {
      // Drop breadcrumbs that may contain tokens / PII from console or UI
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.filter(
          (b) => b.category !== 'console',
        );
      }
      if (event.request?.headers) {
        delete event.request.headers.Authorization;
        delete event.request.headers.authorization;
      }
      return event;
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

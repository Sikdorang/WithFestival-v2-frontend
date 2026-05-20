import * as Sentry from '@sentry/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n';
import './index.css';

Sentry.init({
  dsn: 'https://0d18615ccfc2e68edc6f69b4f31d9c6d@o4511387162771456.ingest.us.sentry.io/4511387171225600',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.consoleLoggingIntegration({ levels: ['log', 'error'] }),
  ],

  tracesSampleRate: 0.5,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

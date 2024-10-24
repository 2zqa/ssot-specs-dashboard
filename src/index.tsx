import * as Sentry from '@sentry/browser';
import { h, render } from 'preact';

import { SsotSpecsDashboard } from '@/components/SsotSpecsDashboard';
import { i18n } from '@/libs';

Sentry.init({
  dsn: import.meta.env.MF_SSOT_SERVER_SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing()],
});

i18n.init({ en: {} });

const rootElement = document.getElementById('ssot-specs-dashboard');

if (rootElement) {
  render(<SsotSpecsDashboard />, rootElement);
}

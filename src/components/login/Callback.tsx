import { route } from 'preact-router';
import { useEffect } from 'preact/hooks';

import { handleCallback } from '@/data/auth';

export function Callback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      handleCallback(code, state)
        .then(() => route('/', true))
        .catch(() => route('/login', true));
    } else {
      route('/', true);
    }
  }, []);

  return null;
}

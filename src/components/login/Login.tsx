import { h } from 'preact';
import { route } from 'preact-router';
import { useEffect } from 'preact/hooks';

import { Button } from '@/components/Button';
import { authenticate, isLoggedIn } from '@/data/auth';

export function Login() {
  // useEffect is used because calling route() in the render function
  // does not work.
  useEffect(() => {
    if (isLoggedIn.value) {
      route('/', true);
    }
  }, []);

  return (
    <div class="max-w-xl mx-auto">
      <h1 class="text-3xl font-semibold my-6">Login with GitLab</h1>
      <p>Click on the button below to login with GitLab.</p>
      <Button onClick={authenticate} class="my-4">
        Login with GitLab
      </Button>
    </div>
  );
}

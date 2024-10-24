import { h } from 'preact';
import { Link } from 'preact-router';

import { isLoggedIn } from '@/data/auth';

interface Props {
  title: string;
  onLogout?: () => void;
}

export function Header(props: Props) {
  return (
    <header class="flex justify-between items-center bg-navbar p-2 mb-4">
      <Link href="/" class="inline-block">
        <h1 class="text-2xl uppercase text-white font-semibold">{props.title}</h1>
      </Link>
      {isLoggedIn.value && (
        <a onClick={props.onLogout} class="text-s text-white">
          logout
        </a>
      )}
    </header>
  );
}

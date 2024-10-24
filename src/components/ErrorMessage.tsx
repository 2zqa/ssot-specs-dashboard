import { h } from 'preact';

import { IconExclamationCircle } from '@/icons';
import { getClasses } from '@/utils';

export interface ErrorMessageProps {
  // Required props
  message: string;

  // Optional props
  class?: string;
  testLocator?: string;
}

export function ErrorMessage(props: ErrorMessageProps) {
  return (
    <div
      data-test={props.testLocator}
      class={getClasses('bg-red-accent-2 text-red-accent-1 py-3 px-4 flex mb-4', props.class)}
    >
      <IconExclamationCircle class="fill-red-accent-1 w-[18px]" />
      <span class="ml-2 flex-1">{props.message}</span>
    </div>
  );
}

import { h } from 'preact';

interface Props {
  class?: string;
}

export function IconCaretDown(props: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class={props.class}>
      <path d="M320 240L160 384 0 240l0-48 320 0 0 48z" />
    </svg>
  );
}

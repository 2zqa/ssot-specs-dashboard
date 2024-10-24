import { h } from 'preact';

interface Props {
  class?: string;
}

export function IconCaretUp(props: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class={props.class}>
      <path d="M0 272L160 128 320 272v48H0V272z" />
    </svg>
  );
}

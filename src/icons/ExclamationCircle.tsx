import { h } from 'preact';

interface Props {
  class?: string;
}

export function IconExclamationCircle(props: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class={props.class}>
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm24-384v24V264v24H232V264 152 128h48zM232 368V320h48v48H232z" />
    </svg>
  );
}

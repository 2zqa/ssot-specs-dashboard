import { type ComponentChild, h } from 'preact';
import { useState } from 'preact/hooks';

import { IconCaretDown } from '@/icons/CaretDown';
import { IconCaretUp } from '@/icons/CaretUp';

interface Props {
  label: string;
  isDefaultOpen?: boolean;
  children?: ComponentChild;
}

export function Collapse(props: Props) {
  const [isOpen, setIsOpen] = useState(props.isDefaultOpen ?? false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div class="my-2">
      <p class="select-none hover:cursor-pointer text-2xl font-semibold" onClick={toggle}>
        {props.label} {isOpen ? <IconCaretDown class="inline-block h-5" /> : <IconCaretUp class="inline-block h-5" />}
      </p>
      <hr class="border-gray-300 my-2" />
      <div hidden={!isOpen}>{props.children}</div>
    </div>
  );
}

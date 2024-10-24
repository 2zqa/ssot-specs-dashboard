import { type ComponentChildren, h } from 'preact';

import { getClasses } from '@/utils';

export interface ButtonProps {
  // Required props
  children: ComponentChildren;
  onClick: () => void;

  // Optional props
  class?: string;
  isDisabled?: boolean;
  isSmall?: boolean;
  priority?: 'primary' | 'secondary' | 'tertiary';
  testLocator?: string;
  type?: 'button' | 'submit' | 'reset';
}

const defaultProps: Partial<ButtonProps> = {
  priority: 'primary',
  type: 'button',
};

export function Button(props: ButtonProps) {
  return (
    <button
      class={getClasses(
        'inline-flex place-items-center font-normal',
        'px-ds-4 active:pt-ds-3.5 active:pb-ds-2.5 py-ds-3',
        props.priority === 'primary' &&
          'text-ds-white bg-primary active:bg-primary focus:bg-primary border-primary active:border-primary focus:border-primary hover:bg-primary-light hover:border-primary-light border-ds-px hover:shadow-ds-button-primary-shadow-hover-active-focus active:shadow-ds-button-primary-shadow-hover-active-focus focus:shadow-ds-button-primary-shadow-hover-active-focus rounded-ds-1 shadow-ds-button-primary-shadow-default',
        props.priority === 'secondary' &&
          'text-ds-blue-grey-900 border-ds-blue-grey-100 border-ds-px hover:text-ds-black active:text-ds-black focus:text-ds-black shadow-ds-button-secondary-shadow-default hover:shadow-ds-button-secondary-shadow-hover-active-focus active:shadow-ds-button-secondary-shadow-hover-active-focus focus:shadow-ds-button-secondary-shadow-hover-active-focus rounded-ds-1 bg-ds-white',
        props.priority === 'tertiary' &&
          'text-ds-blue-grey-900 underline hover:text-ds-black active:text-ds-black focus:text-ds-black hover:no-underline active:no-underline focus:no-underline py-ds-2',
        props.isDisabled && 'opacity-50 cursor-not-allowed',
        props.class,

        // FIXME Small variant should come from the design system.
        props.isSmall && '!py-2 !px-3 !text-sm',

        // In case of a loading spinner we want to make sure the button height doesn't change.
        // FIXME This prevents the button from having the 'pressed-in' effect which comes from the design system.
        '!h-11 !py-0'
      )}
      onClick={props.onClick}
      disabled={props.isDisabled}
      type={props.type}
      data-test={props.testLocator}
    >
      {props.children}
    </button>
  );
}

Button.defaultProps = defaultProps;

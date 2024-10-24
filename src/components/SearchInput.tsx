import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import { IconSearch, IconX } from '@/icons';
import { i18n } from '@/libs';
import { getClasses } from '@/utils';

export interface SearchInputProps {
  // Required props
  id: string;
  onInput: (value: string) => void;
  query: string;

  // Optional props
  class?: string;
  isDisabled?: boolean;
  label?: string;
  placeholder?: string;
  shouldAutoFocus?: boolean;
  shouldShowSearchIcon?: boolean;

  // Optional handlers
  onKeyDown?: (e: KeyboardEvent) => void;
}

const defaultProps: Partial<SearchInputProps> = {
  placeholder: i18n.t('search_input.placeholder'),
  shouldShowSearchIcon: true,
};

export function SearchInput(props: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (props.shouldAutoFocus) {
      focusInput();
    }
  }, [props.shouldAutoFocus]);

  return (
    <div class={props.class}>
      {props.label && <label for={props.id}>{props.label}</label>}

      <div class="relative">
        <input
          class={getClasses(
            'bg-ds-white disabled:bg-ds-blue-grey-50 border-ds-blue-grey-100 focus:border-ds-blue-400 invalid:border-ds-red-500 rounded-ds-1 border-ds-px shadow-ds-input-shadow-default-hover-error-disabled hover:shadow-ds-input-shadow-default-hover-error-disabled invalid:shadow-ds-input-shadow-default-hover-error-disabled disabled:shadow-ds-input-shadow-default-hover-error-disabled focus:shadow-ds-input-shadow-focus p-ds-2 text-ds-blue-grey-900 placeholder-ds-grey-300',
            props.isDisabled && 'cursor-not-allowed',
            props.shouldShowSearchIcon && 'pl-10',
            'voipgrid-search-component outline-none w-full font-normal'
          )}
          id={props.id}
          disabled={props.isDisabled}
          placeholder={props.placeholder}
          ref={inputRef}
          type="search"
          value={props.query}
          onKeyDown={props.onKeyDown}
          onInput={(e) => props.onInput((e.target as HTMLInputElement).value)}
        />

        {props.shouldShowSearchIcon && (
          <span onClick={focusInput} class="absolute top-0 bottom-0 left-4 h-full flex items-center">
            <IconSearch class="text-ds-grey-300 invalid:text-ds-grey-300 disabled:text-ds-grey-300 hover:text-ds-grey-400 focus:text-ds-blue-500 w-5" />
          </span>
        )}

        {props.query && !props.isDisabled && (
          <span
            class="text-ds-grey-300 invalid:text-ds-grey-300 disabled:text-ds-grey-300 hover:text-ds-grey-400 focus:text-ds-blue-500 absolute top-0 bottom-0 right-4 h-full flex items-center cursor-pointer"
            onClick={() => props.onInput('')}
          >
            <IconX class="fill-[#444444] w-3" />
          </span>
        )}
      </div>
    </div>
  );
}

SearchInput.defaultProps = defaultProps;

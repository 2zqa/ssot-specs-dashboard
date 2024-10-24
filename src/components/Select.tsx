import { type ComponentChildren, Fragment, h } from 'preact';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import accents from 'remove-accents';

import { Button } from '@/components/Button';
import { SearchInput } from '@/components/SearchInput';
import { IconCheck, IconSort } from '@/icons';
import { i18n } from '@/libs';
import { getClasses } from '@/utils/getClasses';

export interface SelectItem<T = unknown> {
  id: string | number;
  label: string;
  labelPostfix?: string;
  value: string | number;
  model: T | undefined;
}

export interface SelectItemSection<T = unknown> {
  name?: string;
  items: Array<SelectItem<T>>;
}

export interface SelectProps<T = unknown> {
  // Required props
  id: string;
  itemSections: Array<SelectItemSection<T>>;

  // Optional props
  class?: string;
  helpText?: string;
  isMultiSelect?: boolean;
  isSearchable?: boolean;
  label?: string;
  onMultiSelectChange?: (items: Array<SelectItem<T>>) => void;
  onSelectChange?: (item: SelectItem<T>) => void;
  placeholder?: string;
  selectedItemIndex?: number;
  selectedItemValue?: string | number;
  isAllSelected?: boolean;
  isDisabled?: boolean;
  hasEmptyItem?: boolean;
  testLocator?: string;
  testLocatorLabel?: string;
  children?: ComponentChildren;
}

const defaultProps: Partial<SelectProps> = {
  isSearchable: true,
  placeholder: i18n.t('select.nothing_selected'),
};

const EMPTY_SELECT_ITEM = { id: '', label: '---------', value: '', model: undefined };

export function Select<T>(props: SelectProps<T>) {
  const [selectedItems, setSelectedItems] = useState<Array<SelectItem<T>>>([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputTextPostfix, setInputTextPostfix] = useState('');
  const [query, setQuery] = useState('');

  const selectRef = useRef<HTMLDivElement>(null);
  const itemsListRef = useRef<HTMLDivElement>(null);

  // Use the useMemo hook here to recalculate the filtered items per section
  // every time the search query has changed or a new itemSections property is given.
  const filteredSections = useMemo(() => {
    return props.itemSections.map<SelectItemSection<T>>((section) => {
      const items = section.items.filter(({ label, labelPostfix }) => {
        // Remove special characters when searching so 'ë' still matches with 'e'.
        // Use lower case so searching on 'E' still matches with 'e'.
        const normalizedLabel = accents.remove(label).toLowerCase();
        const normalizedQuery = accents.remove(query).toLowerCase();

        let hasMatch = normalizedLabel.includes(normalizedQuery);
        // Also check if there is a match with the labelPostfix property if it's available.
        if (labelPostfix && !hasMatch) {
          const normalizedLabelPostfix = accents.remove(labelPostfix).toLowerCase();
          hasMatch = normalizedLabelPostfix.includes(normalizedQuery);
        }
        return hasMatch;
      });

      // Add an empty item to the list of items after filtering to ensure it's always in the selection.
      if (props.hasEmptyItem && !items.includes(EMPTY_SELECT_ITEM)) {
        items.unshift(EMPTY_SELECT_ITEM);
      }

      return { ...section, items };
    });
  }, [props.itemSections, query, props.hasEmptyItem]);

  // Calculate the allItems array whenever a new itemSections property is given.
  const allItems = useMemo(() => {
    // Pre-select empty item and make that the placeholder.
    if (props.hasEmptyItem) {
      props.placeholder = EMPTY_SELECT_ITEM.label;
      props.itemSections[0].items.unshift(EMPTY_SELECT_ITEM);
    }
    return props.itemSections.flatMap((section) => section.items);
  }, [props.itemSections]);

  const toggleItem = (item: SelectItem<T>, shouldTriggerOnChangeEvent = true) => {
    let items: Array<SelectItem<T>>;

    // If we have a single select, we prevent unselecting the selected item
    if (!props.isMultiSelect && selectedItems.includes(item)) {
      return;
    }

    if (selectedItems.includes(item)) {
      items = selectedItems.filter((other) => other !== item);
    } else {
      items = props.isMultiSelect ? [...selectedItems, item] : [item];
    }

    if (shouldTriggerOnChangeEvent) {
      if (props.isMultiSelect && props.onMultiSelectChange) {
        props.onMultiSelectChange(items);
      }
      if (!props.isMultiSelect && props.onSelectChange) {
        props.onSelectChange(item);
      }
    }

    setSelectedItems(items);
  };

  const toggleItems = (items: Array<SelectItem<T>>) => {
    props.onMultiSelectChange && props.onMultiSelectChange(items);
    setSelectedItems(items);
  };

  // Click outside the root element to close the dropdown.
  const onMouseDown = (e: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
      setDropdownVisible(false);
    }
  };

  // Press escape to close the dropdown.
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setDropdownVisible(false);
    }
  };

  // When the search input is focused, pressing the arrows keys will move the focus to the first item.
  const onSearchInputKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        e.preventDefault();
        (itemsListRef.current?.firstElementChild as HTMLButtonElement)?.focus();
        break;
    }
  };

  // Add support to navigate items with arrow keys.
  const onItemKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        {
          e.preventDefault();
          let sibling = (e.target as HTMLElement).previousElementSibling;

          if (sibling?.nodeName === 'SPAN') {
            sibling = sibling.previousElementSibling;
          }

          (sibling as HTMLElement)?.focus();
        }
        break;

      case 'ArrowDown':
        {
          e.preventDefault();
          let sibling = (e.target as HTMLElement).nextElementSibling;

          if (sibling?.nodeName === 'SPAN') {
            sibling = sibling.nextElementSibling;
          }

          (sibling as HTMLElement)?.focus();
        }
        break;
    }
  };

  // Add event listeners when the component mounts, and remove
  // the event listeners when the component dismounts.
  useEffect(() => {
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  // Whenever our list of selected items has changed we update the text in the select button.
  // We use useLayoutEffect here to prevent the dropdown from flickering because we update
  // different kinds of state variables at the same time.
  useLayoutEffect(() => {
    if (props.isMultiSelect) {
      if (selectedItems.length) {
        setInputText(i18n.t('select.items_selected', { value: selectedItems.length, max: allItems.length }));
        setInputTextPostfix('');
      } else {
        setInputText('');
        setInputTextPostfix('');
      }
    } else {
      const selectedItem = selectedItems[0];

      if (selectedItem && selectedItem !== EMPTY_SELECT_ITEM) {
        setInputText(selectedItem.label);
        setInputTextPostfix(selectedItem.labelPostfix || '');
      } else {
        setInputText('');
        setInputTextPostfix('');
      }
      setDropdownVisible(false);
    }
  }, [selectedItems, allItems.length, props.isMultiSelect]);

  // If the dropdown is opened, focus the search input (does so automatically) if enabled otherwise the first item.
  useEffect(() => {
    if (isDropdownVisible) {
      if (!props.isSearchable) {
        (itemsListRef.current?.firstElementChild as HTMLButtonElement)?.focus();
      }
    }
  }, [isDropdownVisible, props.isSearchable]);

  // If the selected index is given, get it from the flattened array that contains all items and select it as the default item.
  useEffect(() => {
    if (props.selectedItemIndex === undefined) {
      return;
    }

    if (props.selectedItemIndex >= allItems.length) {
      throw new Error('The selectedItemIndex property is bigger or equal than allItems.length');
    }

    // Select the item but don't trigger the onChange event otherwise a common use case would be
    // that the component on load would execute an API request.
    toggleItem(allItems[props.selectedItemIndex], false);
  }, [props.selectedItemIndex, allItems]);

  // Instead of selecting an index number, find the to-be-selected item using its value.
  useEffect(() => {
    if (props.selectedItemValue === undefined) {
      return;
    }

    const selectedItemIndex = allItems.findIndex((item) => item.value === props.selectedItemValue);

    if (selectedItemIndex === -1) {
      return;
    }

    toggleItem(allItems[selectedItemIndex], false);
  }, [props.selectedItemValue, allItems]);

  useEffect(() => {
    if (!props.isMultiSelect && !props.isAllSelected) {
      return;
    }

    setSelectedItems(allItems);
  }, [props.isMultiSelect, props.isAllSelected, allItems]);

  return (
    <div class={props.class} ref={selectRef} data-test={props.testLocator}>
      {props.label && (
        <div class="mb-2">
          <label for={props.id} data-test={props.testLocatorLabel} class="text-ds-blue-grey-900 font-ds-fw-medium">
            {props.label}
          </label>
        </div>
      )}

      <div class="relative font-normal">
        <input
          class="bg-ds-white disabled:bg-ds-blue-grey-50 border-ds-blue-grey-100 focus:border-ds-blue-400 invalid:border-ds-red-500 placeholder-ds-grey-300 text-ds-blue-grey-900 rounded-ds-1 border-ds-px shadow-ds-input-shadow-default-hover-error-disabled hover:shadow-ds-input-shadow-default-hover-error-disabled invalid:shadow-ds-input-shadow-default-hover-error-disabled disabled:shadow-ds-input-shadow-default-hover-error-disabled focus:shadow-ds-input-shadow-focus p-ds-2 flex items-center justify-between w-full outline-none cursor-pointer"
          id={props.id}
          placeholder={inputText ? '' : props.placeholder}
          readOnly={true}
          onClick={() => setDropdownVisible((isDropdownVisible) => !isDropdownVisible)}
          disabled={props.isDisabled}
        />

        {inputText && (
          <span class="absolute top-0 left-0 w-full h-full flex items-center space-x-2 pointer-events-none truncate">
            <span class="ml-2">{inputText}</span>
            {inputTextPostfix && <span class="text-gray-400">{inputTextPostfix}</span>}
          </span>
        )}

        <span class="absolute top-0 right-4 h-full flex items-center">
          <IconSort class="fill-gray-900 w-2" />
        </span>

        {isDropdownVisible && (
          <div class="shadow-ds-dropdown-options-shadow-default bg-ds-white border-ds-blue-grey-100 rounded-ds-1 flex flex-col w-full absolute z-[1000] p-0">
            {props.isSearchable && (
              <SearchInput
                onKeyDown={onSearchInputKeyDown}
                class="p-ds-1"
                query={query}
                onInput={setQuery}
                shouldAutoFocus={true}
                shouldShowSearchIcon={false}
              />
            )}
            {props.isMultiSelect && (
              <div class="py-ds-2 px-ds-1 space-x-ds-2">
                <Button priority="secondary" onClick={() => toggleItems([...allItems])}>
                  {i18n.t('select.select_all')}
                </Button>
                <Button priority="secondary" onClick={() => toggleItems([])}>
                  {i18n.t('select.deselect_all')}
                </Button>
              </div>
            )}
            <div class="flex flex-col overflow-x-auto max-h-[210px]" ref={itemsListRef}>
              {filteredSections.map(({ name, items }) => (
                <Fragment key={name}>
                  {name && (
                    <span class="text-ds-grey-400 bg-ds-blue-grey-50 px-ds-2 py-ds-1 uppercase text-ds-fs-sm font-ds-fw-medium">
                      {name}
                    </span>
                  )}
                  {items.map((item) => {
                    // We're using JSON stringify to do string comparison instead of object comparison
                    // const one = {name : "John", org: "Voys"};
                    // const two = {name : "John", org: "Voys"};
                    // const equal = one === two; // false
                    // const equal = JSON.stringify(one) === JSON.stringify(two) // true
                    const isSelected = selectedItems
                      .map((other) => JSON.stringify(other))
                      .includes(JSON.stringify(item));

                    return (
                      <button
                        type="button"
                        key={item.id}
                        class={getClasses(
                          isSelected && 'text-ds-white bg-ds-blue-400 p-ds-2 space-x-ds-2',
                          !isSelected &&
                            'text-ds-blue-grey-900 bg-ds-white p-ds-2 hover:text-ds-white hover:bg-ds-blue-400 space-x-ds-2 last:rounded-b-ds-1',
                          'group flex items-center text-left'
                        )}
                        onKeyDown={onItemKeyDown}
                        onClick={() => toggleItem(item)}
                        tabIndex={0}
                      >
                        <div class={getClasses(!isSelected && 'invisible', 'pr-2')}>
                          <IconCheck class="fill-white w-4" />
                        </div>
                        <span>{item.label}</span>
                        <span class={getClasses(!isSelected && 'text-gray-400 group-hover:text-white')}>
                          {item.labelPostfix}
                        </span>
                      </button>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {props.helpText && <p class="text-ds-grey-400 mt-2">{props.helpText}</p>}

      {props.children}
    </div>
  );
}

Select.defaultProps = defaultProps;

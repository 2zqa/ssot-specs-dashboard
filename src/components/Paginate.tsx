import { Fragment, h } from 'preact';

import { Button } from '@/components/Button';
import { IconLoader } from '@/icons/Loader';

interface Props {
  page: number;
  itemsPerPage: number;
  totalItems: number;
  isLoadingNewPage: boolean;
  pageSizeOptions: Array<number>;
  defaultPageSizeIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (itemsPerPage: number) => void;
}

export function Paginate(props: Props) {
  const pageCount = Math.ceil(props.totalItems / props.itemsPerPage);
  if (props.page > pageCount || props.page < 1 || props.itemsPerPage <= 0) {
    return <b>Error!</b>;
  }

  function handleSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    props.onPageSizeChange(parseInt(target.value));
  }

  return (
    <>
      <div class="flex items-center gap-2">
        <p>
          Showing {(props.page - 1) * props.itemsPerPage + 1} to{' '}
          {Math.min(props.page * props.itemsPerPage, props.totalItems, props.totalItems)} of {props.totalItems} devices
        </p>
        <select class="inline-block" onChange={handleSelectChange}>
          {props.pageSizeOptions.map((option, index) => (
            <option key={option} value={option} selected={index === props.defaultPageSizeIndex}>
              {option}
            </option>
          ))}
        </select>
        {props.isLoadingNewPage && <IconLoader class="inline-block h-5" />}
      </div>
      <div class="flex justify-center">
        <Button onClick={() => props.onPageChange(props.page - 1)} priority="tertiary" isDisabled={props.page === 1}>
          Previous
        </Button>
        <Button
          onClick={() => props.onPageChange(props.page + 1)}
          priority="tertiary"
          isDisabled={props.page === pageCount}
        >
          Next
        </Button>
      </div>
    </>
  );
}

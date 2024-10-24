import { type ComponentChildren, h } from 'preact';
import { useMemo, useState } from 'preact/hooks';

import { IconCaretDown, IconCaretUp } from '@/icons';
import { getClasses } from '@/utils';

export interface TableProps {
  // Required prop
  data: TableData;
  layout: 'fixed' | 'auto';

  // Optional props
  class?: string;
  onSort?: (header: TableHeader, newSortingMode: string) => void;
}

export interface TableHeader {
  name: string;
  property: string;
  isSortable: boolean;
}

type SortingMode = 'ascending' | 'descending';

export interface TableSortingHeader extends TableHeader {
  sortingMode: SortingMode;
}

export interface TableRow {
  onClick?: () => void;
  [property: string]: ComponentChildren; // includes string and number among other types
}

export interface TableData {
  headers: Array<TableHeader>;
  rows: Array<TableRow>;
}

const defaultProps: Partial<TableProps> = {};

export function Table(props: TableProps) {
  const [sortingHeader, setSortingHeader] = useState<TableSortingHeader | null>(null);

  const onHeaderClick = (header: TableHeader) => {
    if (!header.isSortable) {
      return;
    }

    let sortingMode: SortingMode = 'ascending';

    if (sortingHeader) {
      sortingMode = sortingHeader.sortingMode;
    }

    if (sortingMode === 'ascending') {
      sortingMode = 'descending';
    } else {
      sortingMode = 'ascending';
    }

    if (props.onSort) {
      props.onSort(header, sortingMode);
    }

    setSortingHeader({ ...header, sortingMode });
  };

  const sortedRows = useMemo(() => {
    const sortRows = (a: TableRow, b: TableRow) => {
      if (!sortingHeader) {
        return 0;
      }

      const aProp = a[sortingHeader.property];
      const bProp = b[sortingHeader.property];

      if (!aProp || !bProp) {
        return 0;
      }

      if (sortingHeader.sortingMode === 'ascending') {
        return aProp.toString().localeCompare(bProp.toString());
      } else {
        return bProp.toString().localeCompare(aProp.toString());
      }
    };

    const rows = [...props.data.rows];
    return props.onSort ? rows : rows.sort(sortRows);
  }, [props.data, props.onSort, sortingHeader]);

  return (
    <table class={getClasses(`border-separate border-spacing-y-2 w-full m-0 table-${props.layout}`, props.class)}>
      <thead>
        <tr>
          {props.data.headers.map((header) => (
            <th
              class={getClasses(
                'text-left text-gray-400 p-3 select-none font-normal',
                header.isSortable ? 'cursor-pointer hover:text-black border-b border-gray-200' : 'cursor-default',
                header.name === sortingHeader?.name && 'text-black border-primary'
              )}
              onClick={() => onHeaderClick(header)}
            >
              <div class="flex justify-between items-center">
                {header.name}
                {header.isSortable &&
                  header.name === sortingHeader?.name &&
                  (sortingHeader.sortingMode === 'ascending' ? (
                    <IconCaretDown class="w-3" />
                  ) : (
                    <IconCaretUp class="w-3" />
                  ))}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedRows.map((row) => (
          <tr onClick={row.onClick} class={row.onClick ? 'cursor-pointer' : ''}>
            {props.data.headers.map(({ property }) => (
              <td class="bg-white p-3 border-gray-200 first:border-l border-y last:border-r first:rounded-l-md last:rounded-r-md">
                {row[property]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

Table.defaultProps = defaultProps;

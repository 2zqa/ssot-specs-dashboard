import { h } from 'preact';

import { Select, type SelectItemSection } from '@/components/Select';
import { type TableHeader } from '@/components/Table';
import { tableHeaders } from '@/data/tableHeaders';

interface Props {
  onColumnFilterChange: (columns: Array<TableHeader>) => void;
}

const itemSections: Array<SelectItemSection<TableHeader>> = [
  {
    name: '',
    items: tableHeaders.map((header) => ({
      id: header.property,
      label: header.name,
      value: header.name,
      model: header,
    })),
  },
];

export function ColumnFilter(props: Props) {
  return (
    <Select<TableHeader>
      id="device-columns-select"
      itemSections={itemSections}
      isMultiSelect={true}
      label="Select which columns should be visible in the table"
      isSearchable={true}
      onMultiSelectChange={(headers) => props.onColumnFilterChange(headers.map(({ model }) => model!))}
      isAllSelected={true}
    />
  );
}

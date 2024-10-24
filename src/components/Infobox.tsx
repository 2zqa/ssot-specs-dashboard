import { h } from 'preact';

import { getClasses } from '@/utils';

interface Row {
  key: string;
  value?: string | null | number;
  unit?: string;
}

interface Props {
  title: string;
  rows: Array<Row>;
  class?: string;
}

export function Infobox(props: Props) {
  return (
    <div class={getClasses('bg-white p-4 border border-gray-200 rounded-md basis-1/5 max-w-md flex-1', props.class)}>
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-semibold">{props.title}</h1>
        {props.rows.map((row) => (
          <div key={row.key} class="flex p-2 flex-row justify-between">
            <span class="font-semibold">{row.key}</span>
            <span class="text-right">
              {row.value ?? <i>Not specified</i>}
              {row.value && row.unit ? ' ' + row.unit : ''}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

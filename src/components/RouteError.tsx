/** fall-back route (handles unroutable URLs) */
import { h } from 'preact';

interface Props {
  type: number;
  url?: string;
  isDefault: boolean;
}

export function RouteError(props: Props) {
  return (
    <section class="error">
      <h2>Error {props.type}</h2>
      <p>It looks like we hit a snag.</p>
      <pre>{props.url ?? ''}</pre>
    </section>
  );
}

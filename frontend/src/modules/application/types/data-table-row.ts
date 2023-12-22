import type { NumberCell, TextCell } from '@glideapps/glide-data-grid';

type CellValue =
  | Pick<NumberCell, 'kind' | 'data' | 'displayData'>
  | Pick<TextCell, 'kind' | 'data' | 'displayData'>;

// T can be const enum or union of literals
type DataTableRow<
  T extends string,
  Title extends string = ' ',
> = Title extends ' '
  ? Partial<{ [key in T]: CellValue }>
  : Partial<{ [key in T]: CellValue }> & Record<Title, CellValue>; // ts doesn't esclude undefined from ts automatically

export type { DataTableRow };

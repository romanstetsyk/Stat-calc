import type { NumberCell, TextCell } from '@glideapps/glide-data-grid';

type CellValue =
  | Pick<NumberCell, 'kind' | 'data' | 'displayData'>
  | Pick<TextCell, 'kind' | 'data' | 'displayData'>;

type DataTableRow<T extends string, Title extends string = never> = Partial<
  Record<T, CellValue>
> &
  Record<Title, CellValue>;

export type { CellValue, DataTableRow };

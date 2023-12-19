// T can be const enum or union of literals
type DataTableRow<
  T extends string,
  Title extends string = 'column',
> = Title extends 'column'
  ? Partial<{
      [key in T]: string | number;
    }>
  : Partial<{
      [key in T]: string | number;
    }> &
      Record<Title, string | number>;

export type { DataTableRow };

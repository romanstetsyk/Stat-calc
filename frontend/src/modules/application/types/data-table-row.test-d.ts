/* eslint-disable @typescript-eslint/no-unused-vars */
import { GridCellKind } from '@glideapps/glide-data-grid';
import { assertType, describe, it } from 'vitest';

import type { CellValue, DataTableRow } from './data-table-row';

describe('DataTableRow', () => {
  const textCell: CellValue = {
    kind: GridCellKind.Text,
    data: 'test',
    displayData: 'test',
  };

  describe('without Title', () => {
    it('should work if object is empty', () => {
      const row: DataTableRow<'a'> = {};
      assertType(row);
    });

    it('should not allow unknown properties', () => {
      // @ts-expect-error Object literal may only specify known properties, and 'b' does not exist in type 'Partial<{ a: CellValue; }>'
      const row: DataTableRow<'a'> = { a: textCell, b: textCell };
      assertType(row);
    });

    it('should work if all properties are present', () => {
      const row: DataTableRow<'a' | 'b'> = { a: textCell, b: textCell };
      assertType(row);
    });

    it('should work if not all properties are present', () => {
      const row: DataTableRow<'a' | 'b'> = { a: textCell };
      assertType(row);
    });

    it('should throw if a value of a property is not a CellValue', () => {
      // @ts-expect-error Type 'string' is not assignable to type 'CellValue | undefined'
      const row: DataTableRow<'a' | 'b'> = { a: 'test string' };
      assertType(row);
    });
  });

  describe('with Title', () => {
    it('should throw if object is empty', () => {
      // @ts-expect-error Property 't' is missing in type '{}' but required in type 'Record<"t", CellValue>'.
      const row: DataTableRow<'a', 't'> = {};
      assertType(row);
    });

    it('should throw if title is not included', () => {
      // @ts-expect-error Property 't' is missing
      const row: DataTableRow<'a', 't'> = { a: textCell };
      assertType(row);
    });

    it('should work if only title is present', () => {
      const row: DataTableRow<'a', 'b'> = { b: textCell };
      assertType(row);
    });

    it('should work if all properties are present', () => {
      const row: DataTableRow<'a', 'b'> = { a: textCell, b: textCell };
      assertType(row);
    });

    it('should throw if element of title is missing', () => {
      // @ts-expect-error property 'c' is missing
      const row: DataTableRow<'a', 'b' | 'c'> = { 'b': textCell };
      assertType(row);
    });
  });
});

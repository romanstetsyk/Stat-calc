import { Button, Center, Spinner, useToast } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';
import type { WorkBook } from 'xlsx';
import { read, utils } from 'xlsx';

import { ArrayLike } from '~/framework/array-like';
import { useGridData } from '~/modules/data-grid/store';
import type { GridData } from '~/modules/data-grid/types';

function classifyInput(value: unknown): string | number {
  switch (typeof value) {
    case 'number': {
      return value;
    }
    case 'string': {
      return value;
    }
    default: {
      return String(value);
    }
  }
}

type FileRow = Record<number, unknown> & { __rowNum__: number };

const parse_wb = (
  wb: WorkBook,
): {
  datasetId: string;
  newRows: GridData['rowData'];
  newCols: GridData['colData'];
} => {
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const range = utils.decode_range(sheet['!ref'] ?? 'A1');
  const headers = Array.from<unknown, `${number}`>(
    { length: range.e.c - range.s.c + 1 },
    (_, i) => `${i + range.s.c}`,
  );
  const data = utils.sheet_to_json<FileRow>(sheet, {
    header: headers,
    // blankrows: true,
  });

  const newRows = new ArrayLike<ArrayLike<string | number>>();
  const newCols = new ArrayLike<ArrayLike<string | number>>();

  for (const row of data) {
    const { __rowNum__, ...rest } = row;
    const newRow = new ArrayLike<string | number>();
    for (const col in rest) {
      newRow.add(Number(col), classifyInput(rest[col]));

      if (!(col in newCols)) {
        newCols.add(Number(col), new ArrayLike<string | number>());
      }
      newCols[col].add(__rowNum__, classifyInput(rest[col]));
    }

    newRows.add(__rowNum__, newRow);
  }

  return { datasetId: nanoid(), newRows, newCols };
};

const FileUpload = (): JSX.Element => {
  const { overwriteRows } = useGridData();
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleClick = async (
    e: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    setLoading(true);
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const fileBuffer = await file.arrayBuffer();

    try {
      const wb = read(fileBuffer, { cellDates: true, dense: true });
      const fileRows = parse_wb(wb);
      overwriteRows(fileRows);
      toast({
        title: 'Success',
        description: 'File opened successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Could not load the file.',
        status: 'error',
        duration: null,
        isClosable: true,
      });
    } finally {
      if (ref.current) {
        ref.current.value = '';
      }
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <Center
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Center>
      )}
      <Button
        px={3}
        py={1}
        transition='all 0.2s'
        borderRadius='md'
        borderWidth='1px'
        _hover={{ bg: 'gray.200' }}
        _expanded={{ bg: 'gray.200' }}
        _focus={{ boxShadow: 'outline' }}
        size='sm'
        onClick={(): void => ref.current?.click()}
      >
        Upload
      </Button>
      <input
        ref={ref}
        type='file'
        name='upload'
        multiple={false}
        onChange={handleClick}
        hidden
      />
    </>
  );
};

export { FileUpload };

import { Button, Center, Spinner, useToast } from '@chakra-ui/react';
import { parseFilename } from '@shared/build/esm/index';
import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';
import { read } from 'xlsx';

import { useGridData } from '~/modules/data-grid/hooks';

import { parseWorkbook } from '../helpers';

const LoadDataset = (): JSX.Element => {
  const { overwriteData } = useGridData();
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
    const { name: title, ext } = parseFilename(file.name);
    const id = crypto.randomUUID();

    try {
      const workbook = read(fileBuffer, { cellDates: true, dense: true });
      const gridData = parseWorkbook(workbook);
      overwriteData({ id, title, ext, ...gridData });
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

export { LoadDataset };

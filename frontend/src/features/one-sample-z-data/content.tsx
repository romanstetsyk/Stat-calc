import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@chakra-ui/react';
import { useContext, useId, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';

import { SessionContext } from '~/contexts/session-context';
import type { DisplayOptions } from '~/types';
import { Perform } from '~/types';

import { Output } from './output';
import { StatForm } from './stat-form';
import type { TForm, Z1DataSession } from './types';

const DEFAULT_SELECTED_FIELDS: TForm = {
  columns: [],
  withLabel: false,
  perform: Perform.HypothesisTest,
  alternative: 'notEqual',
  nullValue: '0',
  alpha: '0.05',
  level: '0.95',
  optional: {
    confidenceInterval: false,
  },
};

type Props = {
  id?: string;
  onClose: () => void;
};

const Content = ({ onClose, id }: Props): JSX.Element => {
  const { session, addSessionItem, updateSessionItem } =
    useContext(SessionContext);

  const formId = useId();
  const [display, setDisplay] = useState<DisplayOptions>('form');
  const [formSummary, setFormSummary] = useState<TForm>(() => {
    const sessionItem = session.find((item) => item.id === id);
    return sessionItem && sessionItem.type === 'z1data'
      ? sessionItem.formSummary
      : DEFAULT_SELECTED_FIELDS;
  });

  const [output, setOutput] = useState<Z1DataSession>();

  const onSaveToSession = (): void => {
    if (output) {
      id ? updateSessionItem(output) : addSessionItem(output);
    }
    onClose();
  };

  const onSubmit: SubmitHandler<TForm> = (data) => {
    const { columns } = data;
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    if (columns.length === 0) {
      return;
    }
    setFormSummary(data);
    setDisplay('result');
  };

  return (
    <ModalContent
      onKeyDown={(e): void => {
        e.stopPropagation();
      }}
    >
      <ModalHeader>One Sample Z Test</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {display === 'form' && (
          <StatForm
            formId={formId}
            onSubmit={onSubmit}
            defaultValues={formSummary}
          />
        )}
        {display === 'result' && (
          <Output
            id={id}
            setDisplay={setDisplay}
            formSummary={formSummary}
            setOutput={setOutput}
          />
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant='ghost' mr={3} onClick={onClose}>
          Close
        </Button>
        {display === 'form' && (
          <Button type='submit' colorScheme='blue' form={formId}>
            Calculate
          </Button>
        )}
        {display === 'result' && (
          <Button colorScheme='blue' onClick={onSaveToSession}>
            Save and Close
          </Button>
        )}
      </ModalFooter>
    </ModalContent>
  );
};

export { Content };

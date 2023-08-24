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

import { Output } from './output';
import { StatForm } from './stat-form';
import type { FrequencyDistributionSession, TForm } from './types';
import { FrequencyDistribution } from './types';

const DEFAULT_SELECTED_FIELDS = {
  columns: [],
  options: [...FrequencyDistribution],
  withLabel: false,
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
    return sessionItem && sessionItem.type === 'frequencyDistribution'
      ? sessionItem.formSummary
      : DEFAULT_SELECTED_FIELDS;
  });

  const [output, setOutput] = useState<FrequencyDistributionSession>();

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
      <ModalHeader>Frequency Distribution</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {display === 'form' && (
          <StatForm
            onSubmit={onSubmit}
            formId={formId}
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
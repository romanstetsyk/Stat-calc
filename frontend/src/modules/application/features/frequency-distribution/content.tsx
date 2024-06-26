import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@chakra-ui/react';
import { useId, useRef, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';

import type { DisplayStep } from '~/modules/application/types';
import { useSessionData } from '~/modules/session/store';

import { Output } from './output';
import { StatForm } from './stat-form';
import type { FrequencyDistributionSession, TForm } from './types';
import { FrequencyDistribution } from './types';

const defaultValues: TForm = {
  columns: [],
  options: [...FrequencyDistribution],
  withLabel: false,
};

type Props = {
  id?: string;
  onClose: () => void;
};

const Content = ({ onClose, id }: Props): JSX.Element => {
  const alertCloseRef = useRef(null);

  const { session, addSessionItem, updateSessionItem } = useSessionData();

  const formId = useId();
  const [display, setDisplay] = useState<DisplayStep>('form');
  const [formSummary, setFormSummary] = useState<TForm | null>(() => {
    const sessionItem = session.find((item) => item.id === id);
    return sessionItem && sessionItem.type === 'frequencyDistribution'
      ? sessionItem.formSummary
      : null;
  });

  const [output, setOutput] = useState<FrequencyDistributionSession>();

  const onSaveToSession = (): void => {
    if (output) {
      id ? updateSessionItem(output) : addSessionItem(output);
    }
    onClose();
  };

  const onSubmit: SubmitHandler<TForm> = (data) => {
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
            defaultValues={formSummary ?? defaultValues}
            alertCloseRef={alertCloseRef}
          />
        )}
        {display === 'result' && formSummary && (
          <Output
            id={id}
            setDisplay={setDisplay}
            formSummary={formSummary}
            setOutput={setOutput}
          />
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant='ghost' mr={3} onClick={onClose} ref={alertCloseRef}>
          Close
        </Button>
        {display === 'form' && (
          <Button type='submit' colorScheme='buttonColorScheme' form={formId}>
            Calculate
          </Button>
        )}
        {display === 'result' && (
          <Button colorScheme='buttonColorScheme' onClick={onSaveToSession}>
            Save and Close
          </Button>
        )}
      </ModalFooter>
    </ModalContent>
  );
};

export { Content };

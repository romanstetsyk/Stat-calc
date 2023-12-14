import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@chakra-ui/react';
import { useId, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';

import { useSessionData } from '~/store/session-data';
import type { DisplayOptions } from '~/types';
import { HypothesisType, Perform } from '~/types';

import { Output } from './output';
import { StatForm } from './stat-form';
import type { TForm, Z1DataSession } from './types';

const defaultValues: TForm = {
  sampleData: {
    columns: [],
    withLabel: false,
  },
  perform: Perform.HypothesisTest,
  hypothesisTest: {
    alternative: HypothesisType.TwoTailed,
    nullValue: 0,
    alpha: 0.05,
    optional: {
      includeConfidenceInterval: false,
    },
  },
  confidenceInterval: {
    confidenceLevel: 0.95,
  },
};

type Props = {
  id?: string;
  onClose: () => void;
};

const Content = ({ onClose, id }: Props): JSX.Element => {
  const { session, addSessionItem, updateSessionItem } = useSessionData();

  const formId = useId();
  const [display, setDisplay] = useState<DisplayOptions>('form');
  const [formSummary, setFormSummary] = useState<TForm | null>(() => {
    const sessionItem = session.find((item) => item.id === id);
    return sessionItem && sessionItem.type === 'z1data'
      ? sessionItem.formSummary
      : null;
  });

  const [output, setOutput] = useState<Z1DataSession>();

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
      <ModalHeader>One Sample Z Test</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {display === 'form' && (
          <StatForm
            formId={formId}
            onSubmit={onSubmit}
            defaultValues={formSummary ?? defaultValues}
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

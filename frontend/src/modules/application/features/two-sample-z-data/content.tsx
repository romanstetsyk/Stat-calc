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

import { HypothesisType, Perform } from '~/modules/application/enums';
import type { DisplayStep } from '~/modules/application/types';
import { useSessionData } from '~/modules/session/store';

import { Output } from './output';
import { StatForm } from './stat-form';
import type { TForm, Z2DataSession } from './types';

const defaultValues: Omit<TForm, 'sample1Data' | 'sample2Data'> &
  Partial<Pick<TForm, 'sample1Data' | 'sample2Data'>> = {
  withLabel: false,
  perform: Perform.HypothesisTest,
  hypothesisTest: {
    nullValue: 0,
    alternative: HypothesisType.TwoTailed,
    alpha: 0.05,
    optional: {
      includeConfidenceInterval: false,
    },
  },
  confidenceInterval: {
    confidenceLevel: 0.95,
  },
  optional: {
    includeSampleStatistics: false,
  },
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
    return sessionItem && sessionItem.type === 'z2data'
      ? sessionItem.formSummary
      : null;
  });

  const [output, setOutput] = useState<Z2DataSession>();

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
      <ModalHeader>Two Sample Z Test</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {display === 'form' && (
          <StatForm
            formId={formId}
            onSubmit={onSubmit}
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

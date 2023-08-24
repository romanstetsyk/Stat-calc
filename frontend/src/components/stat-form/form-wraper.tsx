import { Flex } from '@chakra-ui/react';
import type { FormEventHandler } from 'react';

type Props = {
  children: React.ReactNode;
  formId: string;
  onSubmit: FormEventHandler<HTMLDivElement>;
};

const FormWraper = ({ children, formId, onSubmit }: Props): JSX.Element => {
  return (
    <Flex as='form' onSubmit={onSubmit} id={formId} direction='column' gap={6}>
      {children}
    </Flex>
  );
};

export { FormWraper };

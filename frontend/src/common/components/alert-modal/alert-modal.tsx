import { WarningIcon } from '@chakra-ui/icons';
import type { AlertDialogProps } from '@chakra-ui/react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { useRef } from 'react';

type Props = Omit<AlertDialogProps, 'leastDestructiveRef' | 'children'> & {
  title: string;
  description: string;
  icon?: JSX.Element;
  onContinue?: () => void;
};

const AlertModal = ({
  isOpen,
  onClose,
  title,
  description,
  icon = <WarningIcon w={6} h={6} color='orange' mr={4} />,
  onContinue,
  ...alertDialogProps
}: Props): JSX.Element => {
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      {...alertDialogProps}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {icon}
            {title}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{description}</AlertDialogBody>

          <AlertDialogFooter>
            <Button variant='ghost' ref={cancelRef} onClick={onClose}>
              Close
            </Button>
            {onContinue && (
              <Button
                ml={3}
                onClick={() => {
                  onContinue();
                  onClose();
                }}
              >
                Continue
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export { AlertModal };

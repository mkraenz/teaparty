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
import { FC, useRef } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void;
  isOpen: boolean;
  name: string;
  onConfirm: () => void;
  executing: boolean;
};

const ConfirmFunctionExecutionDialog: FC<Props> = ({
  onConfirm,
  isOpen,
  name,
  onClose,
  executing,
}) => {
  const cancelRef = useRef<any>();
  const { t } = useTranslation();

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      closeOnOverlayClick={!executing}
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader textTransform={'capitalize'}>
          {t('confirmFunctionExecutionDialogHeader', { name })}
        </AlertDialogHeader>
        <AlertDialogCloseButton disabled={executing} />
        <AlertDialogBody _firstLetter={{ textTransform: 'uppercase' }}>
          {executing
            ? t('executing')
            : t('confirmFunctionExecutionDialogBody', { name })}
        </AlertDialogBody>
        <AlertDialogFooter>
          {!executing && (
            <Button ref={cancelRef} onClick={onClose}>
              {t('cancel')}
            </Button>
          )}
          {
            <Button
              colorScheme="red"
              ml={3}
              isLoading={executing}
              onClick={onConfirm}
            >
              {t('executeButton')}
            </Button>
          }
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmFunctionExecutionDialog;

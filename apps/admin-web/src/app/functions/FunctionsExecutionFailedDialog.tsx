import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
  useClipboard,
} from '@chakra-ui/react';
import { CopyToClipboardButton } from '@teaparty/shared-ui';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void;
  isOpen: boolean;
  name: string;
  error: Error | null;
};

const FunctionExecutionFailedDialog: FC<Props> = ({
  isOpen,
  onClose,
  name,
  error,
}) => {
  const { t } = useTranslation();
  const errorMessageClipboard = useClipboard('');
  const errorObjectClipboard = useClipboard('');

  const stringifiedError = () => {
    try {
      return JSON.stringify(error);
    } catch (error) {
      return t('executionFailedStringifyingErrorFailed');
    }
  };
  const handleCopyObject = () => {
    errorObjectClipboard.setValue(stringifiedError());
    errorObjectClipboard.onCopy();
  };
  const handleCopyMessage = () => {
    errorMessageClipboard.setValue(error?.message ?? '');
    errorMessageClipboard.onCopy();
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={false} // make sure the user notices the execution result
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textTransform={'capitalize'}>{t('error')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack width={'full'} align={'flex-start'}>
            <Text>{t('executionFailed', { name })}</Text>
            <HStack width="full">
              <CopyToClipboardButton
                disabled={Boolean(error?.message)}
                onPress={handleCopyMessage}
                hasCopied={errorMessageClipboard.hasCopied}
              />
              <Text>{t('executionFailedFrontendResult')}</Text>
            </HStack>
            <Textarea
              value={error?.message ?? t('unknownError')}
              readOnly={true}
            />
            <HStack width="full">
              <CopyToClipboardButton
                onPress={handleCopyObject}
                hasCopied={errorObjectClipboard.hasCopied}
              />
              <Text>{t('executionFailedFrontendResultStringified')}</Text>
            </HStack>
            <Textarea value={stringifiedError()} readOnly={true} />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            {t('ok')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FunctionExecutionFailedDialog;

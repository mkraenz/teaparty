import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  onClose: () => void;
  isOpen: boolean;
  name: string;
};

const FunctionExecutionSucceededDialog: FC<Props> = ({
  isOpen,
  onClose,
  name,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={false} // make sure the user notices the execution result
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textTransform={'capitalize'}>{t('success')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{t('executedSuccessfully', { name })}</ModalBody>

        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={onClose}>
            {t('ok')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FunctionExecutionSucceededDialog;

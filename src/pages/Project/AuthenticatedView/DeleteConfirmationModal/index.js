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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc={!loading}
      closeOnOverlayClick={!loading}
    >
      <ModalOverlay />
      <ModalContent rounded={'2px'}>
        <ModalHeader
          boxShadow={'0px 1px 0px rgba(0, 0, 0, 0.25)'}
          lineHeight={'56px'}
          py={0}
        >
          {t('Confirmation')}
        </ModalHeader>
        {!loading && <ModalCloseButton boxSize={'20px'} top={'12px'} />}
        <ModalBody p={'24px 24px 100px'}>
          {t('Are you sure you want to delete?')}
        </ModalBody>
        <ModalFooter justifyContent={'space-between'}>
          <Button isLoading={loading} w={'120px'} onClick={onClose}>
            {t('Cancel')}
          </Button>
          <Button
            isLoading={loading}
            variant={'primary'}
            w={'132px'}
            onClick={async () => {
              setLoading(true);
              await onConfirm();
              setLoading(false);
              onClose();
            }}
          >
            {t('Delete')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;

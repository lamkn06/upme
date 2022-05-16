import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Heading,
  useBoolean,
  ModalCloseButton,
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import React from 'react';
import { useTranslation } from 'react-i18next';

const GetMoreStorageModalBody = loadable(() =>
  import('./GetMoreStorageModalBody')
);
const RequestFormModalBody = loadable(() => import('./RequestFormModalBody'));

function StorageModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const [isRequestFormOpen, openRequestForm] = useBoolean(false);

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        rounded={'2px'}
        minH={'249px'}
        maxH={isRequestFormOpen ? '521px' : '711px'}
        maxW={isRequestFormOpen ? '500px' : '730px'}
      >
        {!isRequestFormOpen && (
          <ModalHeader p={'16px 24px'}>
            <Heading variant={'h5'}>{t('Get More Storage')}</Heading>

            <ModalCloseButton
              boxSize={'22px'}
              top={'16px'}
              right={'24px'}
              _focus={{}}
              _hover={{}}
              onClick={onClose}
            />
          </ModalHeader>
        )}

        {isRequestFormOpen ? (
          <RequestFormModalBody
            onClose={() => {
              openRequestForm.off();
              onClose();
            }}
          />
        ) : (
          <GetMoreStorageModalBody openRequestForm={openRequestForm.on} />
        )}
      </ModalContent>
    </Modal>
  );
}

export default StorageModal;

import {
  Box,
  Text,
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ExclamationCircle } from '../../../images/icons/u_exclamation-circle.svg';

const ExceedCapacityModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <Modal
      isCentered
      closeOnEsc={false}
      closeOnOverlayClick={false}
      scrollBehavior={'inside'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent rounded={'2px'} minH={'269px'} minW={'472px'} ml={0}>
        <ModalBody p={'40px 32px 24px'}>
          <Box
            as={ExclamationCircle}
            boxSize={'40px'}
            fill={'Alert'}
            mb={'20px'}
            mx={'auto'}
          />
          <Text variant={'subtitle1'} mb={'4px'}>
            {t('ExceedCapacityMessage')}
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button variant={'primary'} onClick={onClose} w={'132px'}>
            {t('OK')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ExceedCapacityModal;

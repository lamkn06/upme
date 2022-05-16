import { Box, ModalBody, ModalContent, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as CloseIcon } from '../../images/icons/u_times.svg';
import { ReactComponent as SuccessIcon } from '../../images/icons/u_check-circle.svg';

function VerifySuccessModal({ isOpen, onClose }) {
  const { t } = useTranslation();

  return (
    <ModalContent rounded={'2px'} minH={'269px'} maxW={'464px'} ml={0}>
      <Box
        as={CloseIcon}
        boxSize={'32px'}
        cursor={'pointer'}
        fill={'#3F4647'}
        m={'26px 26px 48px auto'}
        onClick={onClose}
      />

      <ModalBody p={'0 32px 40px'}>
        <Box as={SuccessIcon} boxSize={'40px'} fill={'#06DCFF'} mb={'20px'} />

        <Text variant={'bodyBig'} mb={'4px'}>
          {t('Registration Successful')}
        </Text>

        <Text variant={'body1'}>
          {t('You can now login to your Upme account')}
        </Text>
      </ModalBody>
    </ModalContent>
  );
}

export default VerifySuccessModal;

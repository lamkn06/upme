import {
  Box,
  ModalBody,
  ModalContent,
  Text,
  Button,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

function VerifyFailedModal({
  onClose,
  errMessage,
}) {
  const { t } = useTranslation();

  return (
    <ModalContent
      rounded={'2px'}
      minH={'211px'}
      maxW={'464px'}
      ml={0}
    >
      <ModalBody p={'40px 32px'}>
        <Box
          d={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
        >
          <Text mb={'40px'}>
            {t(errMessage)}
          </Text>
          <Button
            isFullWidth
            variant={'primary'}
            h={'48px'}
            onClick={onClose}
          >
            {t('OK')}
          </Button>
        </Box>
      </ModalBody>
    </ModalContent>
  );
}

export default VerifyFailedModal;
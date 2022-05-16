import { Box, Center, VStack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Center minH={'100vh'}>
      <VStack>
        <Box fontSize={'48px'}>404</Box>
        <Box fontSize={'32px'}>{t('Page not found')}</Box>
      </VStack>
    </Center>
  );
}

export default NotFoundPage;

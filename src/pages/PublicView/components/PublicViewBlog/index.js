import {
  Box,
  Heading,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';


function PublicViewBlog() {
  const { t } = useTranslation();

  return (
    <Box flexGrow={1} py={'40px'}>
      <Heading
        as={'h5'}
        mt={'48px'}
        mb={'48px'}
        variant={'h5'}
      >{t('Blog')}
      </Heading>
    </Box>
  );
}

export default PublicViewBlog;

import { Box, Button, useBoolean } from '@chakra-ui/react';
import loadable from '@loadable/component';
import React from 'react';
import { useTranslation } from 'react-i18next';

const PreviewModal = loadable(() => import('../PreviewModal'));

const PreviewButton = () => {
  const { t } = useTranslation();
  const [isPreviewModalOpen, setPreviewModalOpen] = useBoolean();

  return (
    <>
      <Box h={'48px'} w={['205px', '196px']} pos={'relative'}>
        <Button
          isFullWidth
          bg={'#06DCFF'}
          color={'black'}
          fontSize={16}
          fontWeight={'bold'}
          h={'full'}
          rounded={0}
          textTransform={'uppercase'}
          onClick={setPreviewModalOpen.on}
        >
          {t('Export resume')}
        </Button>

        <Box
          bg={'#F03D3E'}
          boxSize={'16px'}
          pos={'absolute'}
          top={'-8px'}
          right={'-8px'}
          rounded={'full'}
        />
      </Box>

      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={setPreviewModalOpen.off}
      />
    </>
  );
};

export default PreviewButton;

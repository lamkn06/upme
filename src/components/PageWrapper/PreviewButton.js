import { Box, Button, useBoolean } from '@chakra-ui/react';
import loadable from '@loadable/component';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectDidPreviewResume,
  toggleDidPreviewResume,
} from '../../slices/user';

const PreviewModal = loadable(() => import('../PreviewModal'));

const PreviewButton = () => {
  const { t } = useTranslation();
  const [isPreviewModalOpen, setPreviewModalOpen] = useBoolean();
  const dispatch = useDispatch();
  const didPreviewResume = useSelector(selectDidPreviewResume);
  const onOpenPreviewModal = useCallback(() => {
    setPreviewModalOpen.on();
    dispatch(toggleDidPreviewResume(true));
  }, [dispatch, setPreviewModalOpen]);

  return (
    <>
      <Box h={'48px'} w={['205px', '196px']} pos={'relative'}>
        <Button
          isFullWidth
          fontSize={16}
          fontWeight={'bold'}
          h={'full'}
          variant={'primary'}
          onClick={onOpenPreviewModal}
        >
          {t('Export resume')}
        </Button>

        {!didPreviewResume && (
          <Box
            bg={'#F03D3E'}
            boxSize={'16px'}
            pos={'absolute'}
            top={'-8px'}
            right={'-8px'}
            rounded={'full'}
          />
        )}
      </Box>

      <PreviewModal
        isOpen={isPreviewModalOpen}
        onClose={setPreviewModalOpen.off}
      />
    </>
  );
};

export default PreviewButton;

import {
  Box,
  Progress,
  Text,
  Button,
  useBoolean,
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { bytesToSize } from '../../utils/userUtils';
import {
  selectCurrentCapacity,
  selectTotalCapacity,
  selectAuthenticationStatus,
  getUserStorageInfo
} from '../../slices/user';

const StorageModal = loadable(() => import('../StorageModal'));

const StorageBar = () => {
  const [isStorageModalOpen, setStorageModalOpen] = useBoolean();
  const currentCapacity = useSelector(selectCurrentCapacity);
  const totalCapacity = useSelector(selectTotalCapacity);
  const isAuthenticated = useSelector(selectAuthenticationStatus);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getUserStorageInfo());
  }, [dispatch]);

  if (!isAuthenticated) return null;
  
  return (
    <Box mt={'39px'}>
      <Progress
        value={(currentCapacity / totalCapacity) * 100}
        background={'white'}
        borderRadius={'24px'}
        h={'8px'}
        colorScheme={'progressBar'} />
        <Text variant={'caption'} mt={'8px'} color={'white'}>
          {t('{{current}} of {{total}} used', {
            current: bytesToSize(currentCapacity),
            total: bytesToSize(totalCapacity),
          })}
        </Text>
        <Button
          variant={'secondary'}
          bg={'none'}
          h={'48px'}
          w={'100%'}
          my={'24px'}
          borderColor={'primary'}
          color={'primary'}
          onClick={setStorageModalOpen.on}
        >
          {t('Upgrade')}
        </Button>
        <StorageModal
          isOpen={isStorageModalOpen}
          onClose={setStorageModalOpen.off}
        />
    </Box>
  );
};

export default StorageBar;

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
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { resetProfile } from '../../slices/profile';
import {
  selectWelcomeBackStatus,
  toggleWelcomeBackStatus,
} from '../../slices/user';

const WelcomeBackModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const welcomeBackStatus = useSelector(selectWelcomeBackStatus);
  const handleToggleWelcomeBackStatus = useCallback(
    (status) => {
      dispatch(toggleWelcomeBackStatus(status));
    },
    [dispatch]
  );
  const handleClose = useCallback(() => {
    handleToggleWelcomeBackStatus(false);
  }, [handleToggleWelcomeBackStatus]);
  const handleRenewProfile = useCallback(() => {
    dispatch(resetProfile());
    handleToggleWelcomeBackStatus(false);
  }, [dispatch, handleToggleWelcomeBackStatus]);

  return (
    <Modal isCentered isOpen={welcomeBackStatus} onClose={handleClose}>
      <ModalOverlay />

      <ModalContent borderRadius={0} minH={'275px'} maxW={'555px'}>
        <ModalHeader
          boxShadow={'0px 1px 0px rgba(0, 0, 0, 0.25)'}
          fontSize={20}
          fontWeight={'semibold'}
        >
          {t('Welcome Back')}
        </ModalHeader>

        <ModalCloseButton top={'18px'} _focus={{}} onClick={handleClose} />

        <ModalBody fontSize={16} py={'24px'} fontStyle={'regular'}>
          {t('Do you want to continue your resume?')}
        </ModalBody>

        <ModalFooter>
          <Button
            variant={'secondary'}
            textTransform={'uppercase'}
            onClick={handleRenewProfile}
          >
            {t('Create new resume')}
          </Button>

          <Button
            variant={'primary'}
            ml={'auto'}
            textTransform={'uppercase'}
            onClick={handleClose}
          >
            {t('Continue')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WelcomeBackModal;

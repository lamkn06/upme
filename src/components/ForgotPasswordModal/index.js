import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useBreakpointValue,
  Heading,
  Text,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as CloseIcon } from '../../images/icons/u_times.svg';
import { ReactComponent as SuccessIcon } from '../../images/icons/u_check-circle.svg';
import { ReactComponent as ExclamationCircle } from '../../images/icons/u_exclamation-circle.svg';
import {
  sendForgotPasswordEmail,
  selectSidebarStatus,
  selectSidebarVisible,
} from '../../slices/user';

function ForgotPasswordModal({
  isOpen,
  onClose,
  onOpenSignInModal,
  openSignupModal,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [emailStatus, setEmailStatus] = useState('idle');
  const isSideBarOpen = useSelector(selectSidebarStatus);
  const isSideBarVisible = useSelector(selectSidebarVisible);
  const marginLeft = useBreakpointValue([0, isSideBarOpen ? '260px' : '72px']);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const onSubmit = (data) => {
    dispatch(sendForgotPasswordEmail(data))
      .unwrap()
      .then(() => {
        setEmailStatus('sent');
      })
      .catch(() => {
        setEmailStatus('sentfail');
      });
  };

  useEffect(() => {
    if (isOpen) {
      setEmailStatus('idle');
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      {emailStatus === 'sent' ? (
        <ModalContent
          rounded={'2px'}
          minH={'269px'}
          maxW={'464px'}
          ml={isSideBarVisible ? marginLeft : 0}
        >
          <Box
            as={CloseIcon}
            boxSize={'32px'}
            cursor={'pointer'}
            fill={'#3F4647'}
            m={'26px 26px 48px auto'}
            onClick={onClose}
          />

          <ModalBody p={'0 32px 40px'}>
            <Box
              as={SuccessIcon}
              boxSize={'40px'}
              fill={'#06DCFF'}
              mb={'20px'}
            />

            <Text variant={'bodyBig'} mb={'4px'}>
              {t('Email sent')}
            </Text>

            <Text variant={'body1'}>
              {t('Check your email and open the link we sent to continue')}
            </Text>
          </ModalBody>
        </ModalContent>
      ) : (
        <ModalContent
          rounded={'2px'}
          minH={'428px'}
          maxW={'464px'}
          ml={isSideBarVisible ? marginLeft : 0}
        >
          <Box
            as={CloseIcon}
            boxSize={'32px'}
            cursor={'pointer'}
            fill={'#3F4647'}
            m={'26px 26px 32px auto'}
            onClick={onClose}
          />

          <ModalBody p={'0 32px 40px'}>
            {emailStatus === 'idle' ? (
              <>
                <Heading variant={'h5'} mb={'12px'}>
                  {t('Forgot Password?')}
                </Heading>

                <Text variant={'body1'} mb={'32px'}>
                  {t(
                    'Enter your email and we’ll send you a link to reset your password'
                  )}
                </Text>
              </>
            ) : (
              <>
                <Box
                  as={ExclamationCircle}
                  boxSize={'40px'}
                  fill={'#06DCFF'}
                  mb={'20px'}
                />

                <Text variant={'bodyBig'} mb={'4px'}>
                  {t('Email not found')}
                </Text>

                <Text variant={'body1'} mb={'24px'}>
                  <Trans>
                    The email is not registered yet. Please try another email or
                    <Button
                      variant={'link'}
                      size={'md'}
                      h={'auto'}
                      ml={'0.25em'}
                      onClick={() => {
                        onClose();
                        openSignupModal();
                      }}
                    >
                      {t('SignUp')}
                    </Button>
                  </Trans>
                </Text>
              </>
            )}

            <FormControl isRequired isInvalid={errors.email} mb={'24px'}>
              <FormLabel mb={'4px'}>{t('Email Address')}</FormLabel>

              <Input
                {...register('email', {
                  required: t('Please input a valid email format'),
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                    message: t('Please input a valid email format'),
                  },
                })}
                type="email"
              />

              {errors.email && (
                <FormErrorMessage>{errors.email.message}</FormErrorMessage>
              )}
            </FormControl>

            <Button
              isFullWidth
              variant={'primary'}
              h={'48px'}
              mb={'16px'}
              onClick={handleSubmit(onSubmit)}
            >
              {t('Send link to email')}
            </Button>

            {emailStatus === 'idle' && (
              <Button
                isFullWidth
                variant={'unstyled'}
                align={'center'}
                h={'auto'}
                onClick={() => {
                  onClose();
                  onOpenSignInModal();
                }}
              >
                {t('Back to Sign-in')}
              </Button>
            )}
          </ModalBody>
        </ModalContent>
      )}
    </Modal>
  );
}

export default ForgotPasswordModal;

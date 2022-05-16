import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Heading,
  Text,
  useBoolean,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { sendResetPassword } from '../../slices/user';
import { ReactComponent as CloseIcon } from '../../images/icons/u_times.svg';
import { ReactComponent as SuccessIcon } from '../../images/icons/u_check-circle.svg';
import { ReactComponent as AngleRight } from '../../images/icons/u_angle-right.svg';
import { ReactComponent as EyeIcon } from '../../images/icons/u_eye.svg';
import { ReactComponent as EyeSlashIcon } from '../../images/icons/u_eye-slash.svg';

function ResetPassword({ isOpen, onClose, openSigninModal, resetToken }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [resetStatus, setResetStatus] = useState('idle');
  const [passwordType, setPasswordType] = useBoolean();
  const [errMessage, setErrMessage] = useState();
  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    dispatch(sendResetPassword(data))
      .unwrap()
      .then(() => {
        setResetStatus('sent');
      })
      .catch((res) => {
        setErrMessage(res.error);
      });
  };

  const setToken = useCallback(() => {
    if (resetToken !== undefined) setValue('token', resetToken);
  }, [resetToken, setValue]);

  useEffect(
    function initForm() {
      reset();
      setToken();
    },
    [reset, setToken]
  );

  return (
    <Modal isCentered isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent rounded={'2px'} minH={'249px'} maxW={'464px'}>
        <Box
          as={CloseIcon}
          boxSize={'32px'}
          cursor={'pointer'}
          fill={'#3F4647'}
          m={'26px 26px 32px auto'}
          onClick={onClose}
        />

        <ModalBody p={'0 32px 40px'}>
          {errMessage !== undefined ? (
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
          )
            : (
              resetStatus === 'idle' ? (
                <>
                  <Heading variant={'h5'} mb={'26px'}>
                    {t('Reset the password?')}
                  </Heading>

                  <FormControl isRequired isInvalid={errors.password} mb={'24px'}>
                    <FormLabel mb={'4px'}>{t('New Password')}</FormLabel>

                    <InputGroup>
                      <Input
                        {...register('password', {
                          required: t('Password cannot be empty'),
                          minLength: {
                            value: 8,
                            message: t('Minimum 8 characters'),
                          },
                        })}
                        type={passwordType ? 'text' : 'password'}
                      />

                      <InputRightElement
                        children={
                          <Box
                            as={passwordType ? EyeIcon : EyeSlashIcon}
                            cursor={'pointer'}
                            fill={'#3F4647'}
                            onClick={setPasswordType.toggle}
                          />
                        }
                      />
                    </InputGroup>
                    {errors.password && (
                      <FormErrorMessage>{errors.password.message}</FormErrorMessage>
                    )}
                  </FormControl>

                  <Button
                    isFullWidth
                    variant={'primary'}
                    h={'48px'}
                    onClick={handleSubmit(onSubmit)}
                  >
                    {t('Reset password')}
                  </Button>
                </>
              ) : (
                <>
                  <Box
                    as={SuccessIcon}
                    boxSize={'40px'}
                    fill={'#06DCFF'}
                    mb={'20px'}
                  />
                  <Text variant={'bodyBig'} mb={'4px'}>
                    {t('Password reset')}
                  </Text>

                  <Button variant={'link'} onClick={openSigninModal}>
                    {t('Sign-in Now')}
                    <Box
                      as={AngleRight}
                      boxSize={'22px'}
                      cursor={'pointer'}
                      fill={'primary'}
                      ml={'16px'}
                    />
                  </Button>
                </>
              )
            )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ResetPassword;

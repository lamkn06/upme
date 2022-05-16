import {
  ModalBody,
  ModalFooter,
  Text,
  Button,
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  ModalHeader,
  ModalCloseButton,
} from '@chakra-ui/react';
import React, { useCallback, useState, useEffect } from 'react';
import TagManager from 'react-gtm-module';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectLocalProfile } from '../../slices/profile';
import { selectUserId, upgradeStorageRequest } from '../../slices/user';
import { ReactComponent as SuccessIcon } from '../../images/icons/u_check-circle.svg';
import { ReactComponent as ExclamationCircle } from '../../images/icons/u_exclamation-circle.svg';

function RequestFormModalBody({ onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const [requestStatus, setRequestStatue] = useState('idle');
  const {
    register,
    formState: { isDirty },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      subject: t('Upgrade subscription plan'),
      content: t('Hello, I want to upgrade my subscription plan.'),
    },
  });
  const requestForm = watch();
  const setDefaultValue = useCallback(() => {
    const { email } = dispatch(selectLocalProfile());

    reset({
      customerEmail: email,
      subject: t('Upgrade subscription plan'),
      content: t('Hello, I want to upgrade my subscription plan.'),
    });
  }, [dispatch, reset, t]);
  const onSubmit = useCallback(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'storage_request',
        user_id: userId,
        user_type: 'Free',
      },
    });
    dispatch(upgradeStorageRequest(requestForm))
      .unwrap()
      .then(() => {
        setRequestStatue('success');
      })
      .catch(() => {
        setRequestStatue('failed');
      });
  }, [dispatch, requestForm, userId]);

  useEffect(() => {
    if (isDirty) {
      reset(requestForm);
    }
  }, [requestForm, isDirty, reset]);

  useEffect(() => {
    setDefaultValue();
  }, [dispatch, setDefaultValue, reset]);

  switch (requestStatus) {
    case 'idle':
      return (
        <>
          <ModalBody p={'24px 24px 0'} mb={'40px'}>
            <Text mb={'27px'}>
              {t(
                'Please fill in the following information. Our customer support member will contact you immediately.'
              )}
            </Text>
            <FormControl id="email" mb={'24px'}>
              <FormLabel mb={'4px'}>{t('Email')}</FormLabel>

              <Input
                {...register('customerEmail')}
                borderRadius={2}
                h={'48px'}
              />
            </FormControl>
            <FormControl id="title" mb={'24px'}>
              <FormLabel mb={'4px'}>{t('Title')}</FormLabel>
              <Input {...register('subject')} borderRadius={2} h={'48px'} />
            </FormControl>
            <FormControl id="content" position={'relative'}>
              <FormLabel mb={'4px'}>{t('Description')}</FormLabel>
              <Box
                color={
                  requestForm.content.length === 500 ? '#E53E3E' : '#C1C9CD'
                }
                position={'absolute'}
                bottom={0}
                right={'5px'}
                fontSize={'14px'}
              >
                {requestForm.content.length}/500
              </Box>
              <Textarea
                {...register('content')}
                maxLength={500}
                paddingBottom={'20px'}
                borderRadius={2}
                resize={'none'}
                sx={{
                  '::-webkit-scrollbar': {
                    w: 0,
                  },
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter justifyContent={'space-between'} pt={0} pb={'40px'}>
            <Button
              variant={'secondary'}
              w={'130px'}
              _hover={{ bg: '#fcfcfc' }}
              onClick={onClose}
            >
              {t('Cancel')}
            </Button>

            <Button variant={'primary'} w={'119px'} onClick={onSubmit}>
              {t('Send')}
            </Button>
          </ModalFooter>
        </>
      );
    case 'success':
      return (
        <>
          <ModalHeader p={'16px 24px'}>
            <ModalCloseButton
              boxSize={'22px'}
              top={'16px'}
              right={'24px'}
              _focus={{}}
              _hover={{}}
              onClick={onClose}
            />
          </ModalHeader>
          <ModalBody p={'48px 32px 40px'}>
            <Box
              as={SuccessIcon}
              boxSize={'40px'}
              fill={'#06DCFF'}
              mb={'20px'}
            />

            <Text variant={'bodyBig'} mb={'4px'}>
              {t('Request sent')}
            </Text>
          </ModalBody>
        </>
      );
    case 'failed':
      return (
        <>
          <ModalHeader p={'16px 24px'}>
            <ModalCloseButton
              boxSize={'22px'}
              top={'16px'}
              right={'24px'}
              _focus={{}}
              _hover={{}}
              onClick={onClose}
            />
          </ModalHeader>
          <ModalBody p={'0 32px 40px'}>
            <Box
              as={ExclamationCircle}
              boxSize={'40px'}
              fill={'#06DCFF'}
              mb={'20px'}
            />

            <Text variant={'bodyBig'} mb={'4px'}>
              {t('Error')}
            </Text>
          </ModalBody>
        </>
      );
    default:
      return null;
  }
}

export default RequestFormModalBody;

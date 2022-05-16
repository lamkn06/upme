import {
  Button,
  Center,
  HStack,
  Image,
  Input,
  useToast,
  VStack,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import SubscribeImage from '../../images/subscribe.svg';
import { subscribeWithEmail } from '../../slices/user';

function Subscribe() {
  const { t } = useTranslation();
  const toast = useToast();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    dispatch(subscribeWithEmail(data.email))
      .unwrap()
      .then(() => {
        toast({
          title: 'Congratulation.',
          description: 'You have been subscribed to Upme!',
          status: 'success',
          duration: 10000,
          position: 'bottom-right',
          isClosable: true,
        });
      })
      .catch((err) => {
        onError(err);
      });
  };
  const onError = (errors) => {
    toast({
      title: 'An error occurred.',
      description: errors.email?.message || t(errors.error),
      status: 'error',
      duration: 10000,
      position: 'bottom-right',
      isClosable: true,
    });
  };

  return (
    <Center
      alignItems={'flex-start'}
      flexDirection={'column'}
      maxW={['100vw', 'auto']}
      mt={'48px'}
    >
      <VStack spacing={0}>
        <Text variant={'body1'} textAlign={'center'}>
          {t('Just a little more before this feature is released')}
        </Text>
        <Text variant={'body1'} textAlign={'center'}>
          {t("We'll let you now as soon as it is out of the oven!")}
        </Text>
      </VStack>

      <HStack spacing={0} mt={'16px'}>
        <InputGroup w={['calc(100vw - 40px)', '455px']}>
          <Input
            {...register('email', {
              required: t('Cannot subscribe without a valid email.'),
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                message: t('Please input a valid email format'),
              },
            })}
            borderEndRadius={0}
            placeholder={t('e.g enter-your-email@gmail.com')}
          />
          <InputRightElement width={'145px'} zIndex={0}>
            <Button
              variant={'primary'}
              borderStartRadius={0}
              h={'48px'}
              w={'162px'}
              onClick={handleSubmit(onSubmit, onError)}
            >
              {t('Follow us')}
            </Button>
          </InputRightElement>
        </InputGroup>
      </HStack>

      <Image src={SubscribeImage} mt={'26px'} />
    </Center>
  );
}

export default Subscribe;

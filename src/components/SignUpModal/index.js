import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useBoolean,
  useBreakpointValue,
} from '@chakra-ui/react';
import get from 'lodash/get';
import React, { useCallback, useState } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import TagManager from 'react-gtm-module';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '../../images/facebook.svg';
import GoogleIcon from '../../images/google.svg';
import { ReactComponent as SuccessIcon } from '../../images/icons/u_check-circle.svg';
import { ReactComponent as EyeSlashIcon } from '../../images/icons/u_eye-slash.svg';
import { ReactComponent as EyeIcon } from '../../images/icons/u_eye.svg';
import { ReactComponent as CloseIcon } from '../../images/icons/u_times.svg';
import { fetchProfileById } from '../../slices/profile';
import {
  selectSidebarStatus,
  selectSidebarVisible,
  signInWithFacebook,
  signInWithGoogle,
  signUpWithCredentials,
} from '../../slices/user';

function SignUpModal({ isOpen, onClose, onOpenSignInModal }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isSideBarOpen = useSelector(selectSidebarStatus);
  const isSideBarVisible = useSelector(selectSidebarVisible);
  const marginLeft = useBreakpointValue([0, isSideBarOpen ? '260px' : '72px']);
  const {
    register,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [passwordType, setPasswordType] = useBoolean();
  const [submitStatus, setSubmitStatus] = useState('idle');
  const onSubmit = (data) => {
    dispatch(signUpWithCredentials(data))
      .unwrap()
      .then(() => {
        setSubmitStatus('success');
        TagManager.dataLayer({
          dataLayer: {
            event: 'sign_up',
            user_id: '',
            method: 'Email',
          },
        });
      })
      .catch((err) => {
        setError('email', {
          type: 'manual',
          message: t(err.error),
        });
      });
  };

  const handleSignInWithGoogleOnSuccess = useCallback(
    ({ profileObj }) => {
      const { name, email, imageUrl: profilePicture } = profileObj;
      dispatch(
        signInWithGoogle({
          email,
          fullName: name,
          displayName: name,
          profilePicture,
        })
      )
        .unwrap()
        .then((res) => {
          dispatch(fetchProfileById({ id: res.data.profile.id }));
          onClose();
          TagManager.dataLayer({
            dataLayer: {
              event: 'login',
              user_id: res.data.id,
              method: 'Google',
            },
          });
        });
    },
    [dispatch, onClose]
  );

  const handleSignInWithFacebook = useCallback(
    (fbRes) => {
      if (fbRes.status === 'unknown') return;
      const { name, email, picture } = fbRes;

      dispatch(
        signInWithFacebook({
          email,
          fullName: name,
          displayName: name,
          pictureProfile: get(picture, 'data.url'),
        })
      )
        .unwrap()
        .then((res) => {
          dispatch(fetchProfileById({ id: res.data.profile.id }));
          onClose();
          TagManager.dataLayer({
            dataLayer: {
              event: 'login',
              user_id: res.data.id,
              method: 'Facebook',
            },
          });
        });
    },
    [dispatch, onClose]
  );

  const handleOnClose = useCallback(() => {
    clearErrors();
    reset();
    setSubmitStatus('idle');
    onClose();
  }, [clearErrors, onClose, reset]);

  return (
    <Modal
      isCentered
      scrollBehavior={'inside'}
      isOpen={isOpen}
      onClose={handleOnClose}
    >
      <ModalOverlay />
      <ModalContent
        rounded={'2px'}
        minH={submitStatus === 'idle' ? '664px' : 'fit-content'}
        maxW={'464px'}
        ml={isSideBarVisible ? marginLeft : 0}
        mx={'8px'}
      >
        <Box
          as={CloseIcon}
          boxSize={'32px'}
          cursor={'pointer'}
          fill={'#3F4647'}
          m={'26px 26px 32px auto'}
          onClick={handleOnClose}
        />
        <ModalBody p={'0 32px 40px'}>
          {submitStatus === 'idle' ? (
            <>
              <Heading variant={'h5'}>
                {t('Create an account to save your progress')}
              </Heading>

              <Flex align={'center'} mt={'16px'}>
                <Text variant={'body1'}>
                  {t('Do you already have an account?')}
                </Text>
                <Button
                  variant={'unstyled'}
                  h={'auto'}
                  ml={'0.25em'}
                  _focus={{}}
                  onClick={() => {
                    handleOnClose();
                    onOpenSignInModal();
                  }}
                >
                  {t('Login Now')}
                </Button>
              </Flex>

              <FormControl isRequired isInvalid={errors.email} mt={'32px'}>
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

              <FormControl
                isRequired
                isInvalid={errors.password}
                mt={'24px'}
                mb={'32px'}
              >
                <FormLabel mb={'4px'}>{t('Password')}</FormLabel>

                <InputGroup>
                  <Input
                    {...register('password', {
                      required: t('Password cannot be empty'),
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
                {t('Create your account free')}
              </Button>

              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                render={({ disabled, onClick }) => (
                  <Button
                    isFullWidth
                    isDisabled={disabled}
                    variant={'secondary'}
                    textTransform={'none'}
                    fontWeight={'normal'}
                    h={'48px'}
                    mt={'16px'}
                    onClick={onClick}
                  >
                    <Image src={GoogleIcon} boxSize={'24px'} mr={'12px'} />
                    Google
                  </Button>
                )}
                onSuccess={handleSignInWithGoogleOnSuccess}
                onFailure={(response) => {
                  console.log(response);
                }}
              />

              <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                autoLoad={false}
                fields="name,email,picture"
                callback={handleSignInWithFacebook}
                render={({
                  isDisabled,
                  isProcessing,
                  isSdkLoaded,
                  onClick,
                }) => (
                  <Button
                    isFullWidth
                    isDisabled={isDisabled}
                    isLoading={isProcessing || !isSdkLoaded}
                    variant={'secondary'}
                    textTransform={'none'}
                    fontWeight={'normal'}
                    h={'48px'}
                    mt={'16px'}
                    onClick={onClick}
                  >
                    <Image src={FacebookIcon} boxSize={'24px'} mr={'12px'} />
                    Facebook
                  </Button>
                )}
              />

              <Box mt={'16px'} align={'center'} color={'mono1'} fontSize={'lg'}>
                <Trans>
                  By signing up I agree to the{' '}
                  <Link
                    as={RouterLink}
                    to={'/legal/terms'}
                    target={'_blank'}
                    color={'primary'}
                    fontWeight={'semibold'}
                  >
                    Terms
                  </Link>{' '}
                  &{' '}
                  <Link
                    as={RouterLink}
                    to={'legal/privacy-policy'}
                    target={'_blank'}
                    color={'primary'}
                    fontWeight={'semibold'}
                  >
                    Privacy Policy
                  </Link>
                </Trans>
              </Box>
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
                {t('Account created')}
              </Text>

              <Text variant={'body1'}>
                {t('Check your email and open the link we sent to continue')}
              </Text>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default SignUpModal;

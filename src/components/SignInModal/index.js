import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useBoolean,
  useBreakpointValue,
  Heading,
  Text,
} from '@chakra-ui/react';
import get from 'lodash/get';
import loadable from '@loadable/component';
import React, { useCallback } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin from 'react-google-login';
import TagManager from 'react-gtm-module';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import FacebookIcon from '../../images/facebook.svg';
import GoogleIcon from '../../images/google.svg';
import { ReactComponent as CloseIcon } from '../../images/icons/u_times.svg';
import { ReactComponent as EyeIcon } from '../../images/icons/u_eye.svg';
import { ReactComponent as EyeSlashIcon } from '../../images/icons/u_eye-slash.svg';
import {
  selectSidebarStatus,
  selectSidebarVisible,
  signInWithCredentials,
  signInWithFacebook,
  signInWithGoogle,
} from '../../slices/user';
import { fetchProfileById } from '../../slices/profile';

const SignUpModal = loadable(() => import('../SignUpModal'));
const ForgotPasswordModal = loadable(() => import('../ForgotPasswordModal'));

function SignInModal({ isOpen, onOpen, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isSideBarOpen = useSelector(selectSidebarStatus);
  const isSideBarVisible = useSelector(selectSidebarVisible);
  const marginLeft = useBreakpointValue([0, isSideBarOpen ? '260px' : '72px']);
  const {
    register,
    formState: { errors },
    setError,
    clearErrors,
    handleSubmit,
  } = useForm();
  const [passwordType, setPasswordType] = useBoolean();
  const [signUpModalStatus, setSignUpModalStatus] = useBoolean();
  const [forgotPasswordModalStatus, setForgotPasswordModalStatus] =
    useBoolean();
  const onSubmit = (data) => {
    dispatch(signInWithCredentials(data))
      .unwrap()
      .then((res) => {
        dispatch(fetchProfileById({ id: res.data.profile.id }));
        onClose();
        TagManager.dataLayer({
          dataLayer: {
            event: 'login',
            user_id: res.data.id,
            method: 'Email',
          }
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
      const { name, email, imageUrl } = profileObj;

      dispatch(
        signInWithGoogle({
          email,
          fullName: name,
          displayName: name,
          profilePicture: imageUrl,
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
            }
          });
        });
    },
    [dispatch, onClose]
  );

  const handleSignInWithFacebook = useCallback(
    (res) => {
      if (!res.status) {
        const { name, email, picture } = res;

        dispatch(
          signInWithFacebook({
            email,
            fullName: name,
            displayName: name,
            profilePicture: get(picture, 'data.url'),
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
              }
            });
          });
      }
    },
    [dispatch, onClose]
  );

  const handleOnClose = () => {
    clearErrors();
    onClose();
  };

  return (
    <>
      <Modal
        isCentered
        scrollBehavior={'inside'}
        isOpen={isOpen}
        onClose={handleOnClose}
      >
        <ModalOverlay />

        <ModalContent
          rounded={'2px'}
          minH={'626px'}
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
            <Heading variant={'h5'}>
              {t('Log in to save your progress')}
            </Heading>

            <Flex align={'center'} mt={'16px'}>
              <Text variant={'body1'}>{t('Are you new to Upme?')}</Text>
              <Button
                variant={'unstyled'}
                h={'auto'}
                ml={'0.25em'}
                _focus={{}}
                onClick={() => {
                  handleOnClose();
                  setSignUpModalStatus.on();
                }}
              >
                {t('Create Account')}
              </Button>
            </Flex>

            <FormControl isRequired mt={'32px'} isInvalid={errors.email}>
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
              mt={'24px'}
              mb={'24px'}
              isInvalid={errors.password}
            >
              <FormLabel mb={'4px'} display={'inline-block'}>
                {t('Password')}
              </FormLabel>
              <Button
                pos={'relative'}
                display={'inline-block'}
                float={'right'}
                variant={'unstyled'}
                h={'auto'}
                mt={'6px'}
                ml={'auto'}
                size={'sm'}
                onClick={() => {
                  handleOnClose();
                  setForgotPasswordModalStatus.on();
                }}
              >
                {t('Forgot Password?')}
              </Button>
              <InputGroup>
                <Input
                  {...register('password', {
                    required: t('Password cannot be empty'),
                  })}
                  type={passwordType ? 'text' : 'password'}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      handleSubmit(onSubmit)();
                    }
                  }}
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
              {t('Login Now')}
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
              // onFailure={(response) => {
              //   console.log(response);
              // }}
            />

            <FacebookLogin
              appId={process.env.REACT_APP_FACEBOOK_APP_ID}
              autoLoad={false}
              fields="name,email,picture"
              callback={handleSignInWithFacebook}
              render={({ isDisabled, isProcessing, isSdkLoaded, onClick }) => (
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
          </ModalBody>
        </ModalContent>
      </Modal>

      <SignUpModal
        isOpen={signUpModalStatus}
        onClose={setSignUpModalStatus.off}
        onOpenSignInModal={onOpen}
      />

      <ForgotPasswordModal
        isOpen={forgotPasswordModalStatus}
        onClose={setForgotPasswordModalStatus.off}
        onOpenSignInModal={onOpen}
        openSignupModal={setSignUpModalStatus.on}
      />
    </>
  );
}
SignInModal.propTypes = SignInModal.props;
export default SignInModal;

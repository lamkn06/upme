import {
  Button,
  Flex,
  useBoolean,
  Heading,
  Text,
  Center,
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PROFILE_STATUS } from '../../slices/profile';
import { setProfile } from '../../slices/profile';
import WelcomeBackgroundLgEn from '../../images/assets/welcome-lg-en.svg';
import WelcomeBackgroundLgVi from '../../images/assets/welcome-lg-vi.svg';
import WelcomeBackgroundSmEn from '../../images/assets/welcome-sm-en.svg';
import WelcomeBackgroundSmVi from '../../images/assets/welcome-sm-vi.svg';

const SignInModal = loadable(() => import('../../components/SignInModal'));
const SignUpModal = loadable(() => import('../../components/SignUpModal'));
const ResetPasswordModal = loadable(() =>
  import('../../components/ResetPasswordModal')
);

function WelcomePage() {
  const { i18n, t } = useTranslation();
  const history = useHistory();

  const dispatch = useDispatch();

  const [resetToken, setResetToken] = useState();

  const [signInModalStatus, setSignInModalStatus] = useBoolean();
  const [signUpModalStatus, setSignUpModalStatus] = useBoolean();
  const [resetPasswordModalStatus, setResetPasswordModalStatus] = useBoolean();

  const handleGuestProfile = useCallback(() => {
    dispatch(
      setProfile({
        profileStatus: PROFILE_STATUS.OLD,
      })
    );
  }, [dispatch]);

  const onOpenSignInModal = useCallback(() => {
    setResetPasswordModalStatus.off();
    setSignInModalStatus.on();
  }, [setResetPasswordModalStatus, setSignInModalStatus]);

  useEffect(() => {
    document.title = 'Upme Welcome';
    return () => {
      document.title = 'Upme';
    };
  }, []);

  useEffect(() => {
    // To remove state containing old token
    if (history.location.state !== undefined) {
      const { state: historyState } = history.location;
      if (historyState?.token) {
        setResetToken(historyState.token);
        setResetPasswordModalStatus.on();
      }

      history.replace();
    }
  }, [history, setResetPasswordModalStatus]);

  return (
    <Center flexDir={'column'} minH={'100vh'} overflow={'hidden'}>
      <Flex
        align={'center'}
        bgImg={
          i18n.language === 'en'
            ? [`url(${WelcomeBackgroundSmEn})`, `url(${WelcomeBackgroundLgEn})`]
            : [`url(${WelcomeBackgroundSmVi})`, `url(${WelcomeBackgroundLgVi})`]
        }
        bgRepeat={'no-repeat'}
        bgPos={'center bottom'}
        direction={'column'}
        grow={1}
        minH={['768px', '1024px']}
        minW={'100vw'}
        pos={'relative'}
        _after={{
          bgColor: '#f8f8f9',
          content: '""',
          h: ['46px', '145px'],
          pos: 'absolute',
          bottom: 0,
          left: 0,
          w: 'full',
          zIndex: -1,
        }}
      >
        <Heading fontSize={[24, 34]} mt={['73px', '120px']} mb={'16px'}>
          {t('Welcome to Upme!')}
        </Heading>

        <Text fontSize={[16, 20]} mb={'48px'} px={'35px'}>
          {t(
            'More than just an online resume, we help you develop your personal branding'
          )}
        </Text>

        <Button
          variant={'primary'}
          h={'48px'}
          w={'280px'}
          onClick={handleGuestProfile}
        >
          {t('Create a guest profile')}
        </Button>

        <Button
          variant={'secondary'}
          bg={'white'}
          h={'48px'}
          w={'280px'}
          mt={['24px', '16px']}
          onClick={setSignInModalStatus.on}
        >
          {t('LOG-IN NOW')}
        </Button>

        <Button
          variant={'secondary'}
          bg={'white'}
          h={'48px'}
          w={'280px'}
          mt={['24px', '16px']}
          onClick={setSignUpModalStatus.on}
        >
          {t('SignUp')}
        </Button>
      </Flex>

      <SignInModal
        isOpen={signInModalStatus}
        onOpen={setSignInModalStatus.on}
        onClose={setSignInModalStatus.off}
      />

      <SignUpModal
        isOpen={signUpModalStatus}
        onClose={setSignUpModalStatus.off}
        onOpenSignInModal={setSignInModalStatus.on}
      />

      <ResetPasswordModal
        isOpen={resetPasswordModalStatus}
        onClose={setResetPasswordModalStatus.off}
        openSigninModal={onOpenSignInModal}
        resetToken={resetToken}
      />
    </Center>
  );
}

export default WelcomePage;

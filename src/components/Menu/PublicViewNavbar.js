import {
  Box,
  Flex,
  Spacer,
  Image,
  Text,
  Button,
  useBoolean,
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router';
import { ReactComponent as MenuIcon } from '../../images/icons/u_align.svg';
import { ReactComponent as HamburgerLeftIcon } from '../../images/icons/u_left-indent.svg';
import { ReactComponent as BackIcon } from '../../images/icons/u_arrow-left.svg';
import { ReactComponent as HomeIcon } from '../../images/icons/u_home.svg';
import emptyPicture from '../../images/avatar-placeholder.svg';
import {
  selectAuthenticationStatus,
  selectUserPage,
  selectSidebarStatus,
  toggleSidebarStatus,
  togglePublicViewStatus,
} from '../../slices/user';
import { selectProfilePicture } from '../../slices/profile';
const SignInModal = loadable(() => import('../SignInModal'));
const SignUpModal = loadable(() => import('../SignUpModal'));

const MotionFlex = motion(Flex);

const PublicViewNavbar = ({ profileData }) => {
  const { page: profilePage } = useParams();
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectAuthenticationStatus);
  const userPage = useSelector(selectUserPage);
  const profilePicture = useSelector(selectProfilePicture);
  const isOpen = useSelector(selectSidebarStatus);
  const [signInModalStatus, setSignInModalStatus] = useBoolean();
  const [signUpModalStatus, setSignUpModalStatus] = useBoolean();
  const methods = useForm({
    defaultValues: {
      selectLanguage: i18n.language === 'en-US' ? 'en' : i18n.language,
    },
  });
  const changeLanguageHandler = (lang) => {
    i18n.changeLanguage(lang);
  };
  const languageOptions = useMemo(
    () => [
      { value: 'en', label: t('EN') },
      { value: 'vi', label: t('VN') },
    ],
    [t]
  );
  const toggleSidebar = () => {
    dispatch(toggleSidebarStatus(!isOpen));
  };

  const openSignInModal = () => {
    setSignInModalStatus.on();
    setSignUpModalStatus.off();
  }

  const openSignUpModal = () => {
    setSignInModalStatus.off();
    setSignUpModalStatus.on();    
  }

  const handleGoToEditPage = () => {
    dispatch(togglePublicViewStatus(false));
    history.push(`/${userPage}`);
  }

  return (
    <MotionFlex
      align={'center'}
      bg={(isAuthenticated && profilePage === userPage) ? '#F8F8F9' : 'white'}
      borderBottom={'1px solid #F8F8F9'}
      direction={'row'}
      d={['none', 'flex']}
      h={'64px'}
      pl={'16px'}
      pr={'40px'}
      pos={'fixed'}
      top={0}
      right={0}
      zIndex={1}
      initial={isOpen ? 'expand' : 'collapse'}
      animate={isOpen ? 'expand' : 'collapse'}
      variants={{ collapse: { left: 72 }, expand: { left: 260 } }}
    >
      <Box
        as={isOpen ? HamburgerLeftIcon : MenuIcon}
        boxSize={'24px'}
        cursor={'pointer'}
        fill={'black'}
        onClick={toggleSidebar}
      />
      <Text fontSize={'xl'} fontWeight={'medium'} ml={26}>
        {t('ProfileData', { profileName: profileData.displayName || profileData.fullName || '?' })}
      </Text>

      <Spacer />

      {isAuthenticated && (
        <Image
          borderRadius={'full'}
          boxSize={'40px'}
          src={profilePicture || emptyPicture}
          mr={'24px'}
        />
      )}

      {!isAuthenticated && (
        <Flex mx={'24px'} direction={'row'} justifyContent={'center'} wrap={'wrap'}>
          <Button
            variant={'link'}
            height={'40px'}
            textTransform={'uppercase'}
            color={'black'}
            onClick={openSignInModal}
            paddingLeft={'16px'}
            paddingRight={'16px'}
          >
            {t('SignIn')}
          </Button>
          <Button variant={'primary'}
            onClick={openSignUpModal}
          >
            {t('SignUp')}
          </Button>
        </Flex>
      )}

      <Controller
        control={methods.control}
        name="selectLanguage"
        render={({ field: { onChange, value, ref } }) => (
          <Select
            inputRef={ref}
            isSearchable={false}
            styles={{
              control: (provided, state) => {
                return {
                  ...provided,
                  borderColor: state.isFocused ? '#06DCFF' : '#E2E8F0',
                  boxShadow: state.isFocused ? '0 0 0 1px #06dcff' : 'none',
                  borderRadius: 2,
                  width: 85,
                  height: 40,
                  ':hover': {
                    borderColor: state.isFocused ? '#06DCFF' : '#CBD5E0',
                  },
                };
              },
              indicatorSeparator: (provided) => ({
                ...provided,
                display: 'none',
              }),
              menuList: (provided) => ({
                ...provided,
                paddingTop: 0,
                paddingBottom: 0,
                fontSize: 'lg',
              }),
              option: (provided) => ({
                ...provided,
                backgroundColor: 'none',
                color: '#3F4647',
                ':hover': {
                  color: '#06DCFF',
                  cursor: 'pointer',
                },
              }),
            }}
            options={languageOptions}
            value={languageOptions.find((c) => c.value === value)}
            onChange={(val) => {
              onChange(val.value);
              changeLanguageHandler(val.value);
            }}
          />
        )}
      />
      {/* user is logged in and profilePage is currentUser Page or user view Profile Page*/}
      {(isAuthenticated && profilePage === userPage) && (
        <Button
          leftIcon={<BackIcon fill={'black'}/>}
          background={'transparent'}
          textTransform={'none'}
          ml={'16px'}
          onClick={handleGoToEditPage}
        >
          {t('Back to edit')}
        </Button>
      )}
      {/* user is logged in and profilePage is not current user profile page*/}
      {(isAuthenticated && profilePage !== userPage &&  profilePage !== undefined) && (
        <Button
          leftIcon={<HomeIcon fill={'black'}/>}
          background={'transparent'}
          textTransform={'none'}
          ml={'16px'}
          onClick={handleGoToEditPage}
        >
          {t('View my profile')}
        </Button>
      )}
      <SignInModal
        isOpen={signInModalStatus}
        onOpen={openSignInModal}
        onClose={setSignInModalStatus.off}
      />
      <SignUpModal
        isOpen={signUpModalStatus}
        onClose={setSignUpModalStatus.off}
        onOpenSignInModal={openSignInModal}
      />
    </MotionFlex>
  );
};

export default PublicViewNavbar;

import {
  Box,
  Button,
  Flex,
  Image,
  Spacer,
  useBoolean,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useOutsideClick,
} from '@chakra-ui/react';
import useSignOut from '../../hooks/useSignOut';
import loadable from '@loadable/component';
import { motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import TagManager from 'react-gtm-module';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import emptyPicture from '../../images/avatar-placeholder.svg';
import { ReactComponent as MenuIcon } from '../../images/icons/u_align.svg';
import { ReactComponent as EyeIcon } from '../../images/icons/u_eye.svg';
import { ReactComponent as HamburgerLeftIcon } from '../../images/icons/u_left-indent.svg';
import { selectProfilePicture } from '../../slices/profile';
import { UserSettingModal } from '../UserSettingModal';

import {
  selectAuthenticationStatus,
  selectSidebarStatus,
  selectUserId,
  togglePublicViewStatus,
  toggleSidebarStatus,
} from '../../slices/user';

const SignInModal = loadable(() => import('../../components/SignInModal'));
const SignUpModal = loadable(() => import('../../components/SignUpModal'));

const MotionFlex = motion(Flex);

const variants = { collapse: { left: 72 }, expand: { left: 260 } };

const languageOptions = [
  { value: 'en', label: 'EN' },
  { value: 'vi', label: 'VN' },
];

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const handleSignOut = useSignOut();

  const [isAuthenticated, isOpen, profilePicture] = [
    useSelector(selectAuthenticationStatus),
    useSelector(selectSidebarStatus),
    useSelector(selectProfilePicture),
  ];
  const userId = useSelector(selectUserId);

  const [signInModalStatus, toggleSignInModal] = useBoolean();
  const [signUpModalStatus, toggleSignUpModal] = useBoolean();
  const [locale, setLocale] = useState(i18n.language);
  const onLocaleChange = useCallback(
    (option) => {
      i18n.changeLanguage(option.value);
      setLocale(option.value);
    },
    [i18n]
  );
  const onToggleSidebar = useCallback(() => {
    dispatch(toggleSidebarStatus(!isOpen));
  }, [dispatch, isOpen]);

  const onTogglePublicView = useCallback(() => {
    dispatch(togglePublicViewStatus(true));
    TagManager.dataLayer({
      dataLayer: {
        event: 'view_as_public',
        user_id: userId,
        user_type: isAuthenticated ? 'Free' : 'Guest',
      },
    });
  }, [dispatch, isAuthenticated, userId]);

  const ref = React.useRef();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isUserSettingModalOpen, setUserSettingModalOpen] = useState(false);

  useOutsideClick({
    ref: ref,
    handler: () => setShowUserDropdown(false),
  });

  return (
    <>
      <MotionFlex
        align={'center'}
        bg={'white'}
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
        variants={variants}
      >
        <Box
          as={isOpen ? HamburgerLeftIcon : MenuIcon}
          boxSize={'24px'}
          cursor={'pointer'}
          fill={'black'}
          onClick={onToggleSidebar}
        />

        <Spacer />

        {isAuthenticated ? (
          <Menu>
            <MenuButton>
              <Image
                borderRadius={'full'}
                boxSize={'40px'}
                src={profilePicture || emptyPicture}
                mr={'24px'}
                cursor={'pointer'}
                onClick={() => setShowUserDropdown(true)}
              />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setUserSettingModalOpen(true)}>
                {t('Settings')}
              </MenuItem>
              <MenuItem onClick={() => handleSignOut(true)}>
                {t('Sign out')}
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <>
            <Button
              variant={'ghost'}
              mr={'8px'}
              _focus={{}}
              _hover={{
                bg: '#F8F8F9',
                color: '#06DCFF',
              }}
              onClick={toggleSignInModal.on}
            >
              {t('SignIn')}
            </Button>

            <Button
              variant={'primary'}
              mr={'24px'}
              minW={'138px'}
              _focus={{}}
              onClick={toggleSignUpModal.on}
            >
              {t('SignUp')}
            </Button>

            <SignInModal
              isOpen={signInModalStatus}
              onOpen={toggleSignInModal.on}
              onClose={toggleSignInModal.off}
            />

            <SignUpModal
              isOpen={signUpModalStatus}
              onClose={toggleSignUpModal.off}
              onOpenSignInModal={toggleSignInModal.on}
            />
          </>
        )}

        <Select
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
          value={languageOptions.find((c) => c.value === locale)}
          onChange={onLocaleChange}
        />

        {isAuthenticated && (
          <Button
            leftIcon={<EyeIcon fill={'black'} />}
            background={'transparent'}
            textTransform={'none'}
            ml={'16px'}
            onClick={onTogglePublicView}
          >
            {t('View as public')}
          </Button>
        )}
      </MotionFlex>
      <UserSettingModal
        isOpen={isUserSettingModalOpen}
        onClose={() => setUserSettingModalOpen(false)}
      />
    </>
  );
};

export default Navbar;

import {
  Box,
  Button,
  Flex,
  Image,
  useBoolean,
  PopoverArrow,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Text,
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useSignOut from '../../hooks/useSignOut';
import AvatarPlaceholder from '../../images/avatar-placeholder.svg';
import Logo from '../../images/logo.svg';
import { ReactComponent as MenuIcon } from '../../images/icons/u_list-ul.svg';
import { ReactComponent as CloseIcon } from '../../images/icons/u_times.svg';
import { ReactComponent as AngleDownIcon } from '../../images/icons/u_angle-down.svg';
import { ReactComponent as HomeIcon } from '../../images/icons/u_home.svg';
import { ReactComponent as BackIcon } from '../../images/icons/u_arrow-left.svg';
import { ReactComponent as EyeIcon } from '../../images/icons/u_eye.svg';
import { selectDisplayName, selectProfile } from '../../slices/profile';
import {
  selectAuthenticationStatus,
  selectUserPage,
  selectPublicViewStatus,
  togglePublicViewStatus,
  selectUserId,
} from '../../slices/user';
import TagManager from 'react-gtm-module';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const MenuItems = loadable(() => import('./MenuItems'));
const PublicViewMenuItems = loadable(() => import('./PublicViewMenuItems'));
const LogoutButton = loadable(() => import('./LogoutButton'));
const SignInModal = loadable(() => import('../../components/SignInModal'));
const SignUpModal = loadable(() => import('../../components/SignUpModal'));
const SelectLanguage = loadable(() => import('./SelectLanguage'));
const StorageBar = loadable(() => import('./StorageBar'));

function TopBar({ profileData }) {
  const publicViewProfile = profileData;
  const { page: profilePage } = useParams();
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isOpen, setOpenStatus] = useBoolean();
  const [signInModalStatus, toggleSignInModal] = useBoolean();
  const [signUpModalStatus, toggleSignUpModal] = useBoolean();
  const [
    displayName,
    isAuthenticated,
    publicViewStatus,
    userPage,
    { profilePicture, fullName },
  ] = [
    useSelector(selectDisplayName),
    useSelector(selectAuthenticationStatus),
    useSelector(selectPublicViewStatus),
    useSelector(selectUserPage),
    useSelector(selectProfile),
  ];
  const userId = useSelector(selectUserId);
  const handleSignOut = useSignOut();

  const handleGoToEditPage = useCallback(() => {
    dispatch(togglePublicViewStatus(false));
    history.push(`/${userPage}`);
  }, [dispatch, history, userPage]);

  const onTogglePublicView = useCallback(() => {
    dispatch(togglePublicViewStatus(true));
    TagManager.dataLayer({
      dataLayer: {
        event: 'view_as_public',
        user_id: userId,
        user_type: isAuthenticated ? 'Free' : 'Guest',
      }
    });
  }, [dispatch, isAuthenticated, userId]);

  const getProfileName = () => {
    return (
      publicViewProfile?.displayName ||
      publicViewProfile?.fullName ||
      displayName ||
      fullName ||
      '?'
    );
  };

  if (publicViewStatus && isAuthenticated && profilePage === userPage) {
    return (
      <Flex
        d={['flex', 'none']}
        h={'56px'}
        w={'100vw'}
        position={'fixed'}
        bg={'#F8F8F9'}
        top={0}
        left={0}
        right={0}
        zIndex={1}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Button
          variant={'ghost'}
          leftIcon={<BackIcon fill={'black'} />}
          background={'transparent'}
          textTransform={'none'}
          onClick={handleGoToEditPage}
        >
          {t('Back to edit')}
        </Button>
      </Flex>
    );
  }

  return (
    <MotionFlex
      d={['flex', 'none']}
      direction={'column'}
      h={isAuthenticated ? '56px' : '104px'}
      position={'fixed'}
      top={0}
      left={0}
      right={0}
      zIndex={1}
      initial={{ opacity: 0, y: -56 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'tween' }}
    >
      <Flex
        align={'center'}
        // position={'relative'}
        bg={'black'}
        h={'56px'}
        w={'100vw'}
        px={'16px'}
      >
        <Image src={Logo} />
        <Text fontSize={'lg'} fontWeight={'medium'} color={'white'} ml={'16px'}>
          {t('ProfileData', { profileName: getProfileName() })}
        </Text>
        <Flex alignItems={'center'} ms={'auto'}>
          {isAuthenticated && (
            <Popover placement="bottom-start">
              <PopoverTrigger>
                <Button
                  variant={'ghost'}
                  rightIcon={<AngleDownIcon fill={'white'} />}
                  h={'56px'}
                  _active={{}}
                  _focus={{}}
                  _hover={{}}
                >
                  <Image
                    borderRadius={'full'}
                    border={'1px solid #DBE1E6'}
                    background={'white'}
                    boxSize={'32px'}
                    src={profilePicture || AvatarPlaceholder}
                  />
                </Button>
              </PopoverTrigger>

              <PopoverContent maxW={'224px'} _focus={{}}>
                <PopoverArrow />
                <PopoverBody>
                  {profilePage !== userPage && profilePage !== undefined && (
                    <Button
                      isFullWidth
                      bg={'none'}
                      border={'1px solid #DBE1E6'}
                      color={'black'}
                      px={0}
                      textTransform={'initial'}
                      _focus={{ bg: 'none' }}
                      onClick={handleGoToEditPage}
                    >
                      <Box
                        as={HomeIcon}
                        boxSize={'24px'}
                        fill={'black'}
                        mr={'8px'}
                      />
                      {t('View my profile')}
                    </Button>
                  )}

                  {!publicViewStatus && (
                    <Button
                      isFullWidth
                      bg={'none'}
                      border={'1px solid #DBE1E6'}
                      color={'black'}
                      px={0}
                      textTransform={'initial'}
                      _focus={{ bg: 'none' }}
                      onClick={onTogglePublicView}
                    >
                      <Box
                        as={EyeIcon}
                        boxSize={'24px'}
                        fill={'black'}
                        mr={'8px'}
                      />
                      {t('View as public')}
                    </Button>
                  )}

                  <Box me={'auto'} w={'fit-content'}>
                    <SelectLanguage isMobile />
                  </Box>

                  <Button
                    isFullWidth
                    variant={'ghost'}
                    color={'black'}
                    fontWeight={'normal'}
                    justifyContent={'flex-start'}
                    me={'auto'}
                    px={0}
                    textTransform={'initial'}
                    _focus={{ bgColor: 'white' }}
                    onClick={handleSignOut}
                  >
                    {t('Sign out')}
                  </Button>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          )}

          <MotionBox
            key={isOpen ? 'openToggle' : 'closeToggle'}
            as={isOpen ? CloseIcon : MenuIcon}
            fill={'white'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={setOpenStatus.toggle}
          />
        </Flex>
      </Flex>

      {!isAuthenticated && (
        <Flex
          align={'center'}
          justifyContent={'flex-end'}
          borderBottom={'1px solid #DBE1E5'}
          bg={'white'}
          color={'black'}
          h={'48px'}
          w={'100vw'}
          px={'16px'}
        >
          <Button
            variant={'ghost'}
            mr={'8px'}
            h={'32px'}
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
            h={'32px'}
            minW={'99px'}
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
        </Flex>
      )}

      <AnimatePresence>
        {isOpen && (
          <MotionFlex
            direction={'column'}
            bg={'black'}
            minH={'100vh'}
            w={'260px'}
            px={'32px'}
            position={'fixed'}
            top={0}
            left={0}
            initial={{ opacity: 0, x: -260 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -260 }}
            transition={{ type: 'tween' }}
          >
            {publicViewStatus ? (
              <PublicViewMenuItems isOpen={isOpen} />
            ) : (
              <>
                <MotionFlex align={'center'} direction={'column'} mt={'98px'}>
                  {profilePicture ? (
                    <Image
                      src={profilePicture}
                      boxSize={112}
                      border={'2px solid white'}
                      borderRadius={24}
                    />
                  ) : (
                    <Image
                      src={AvatarPlaceholder}
                      bg={'#F8F8F9'}
                      boxSize={112}
                      border={'2px solid white'}
                      borderRadius={24}
                      pt={'12px'}
                      px={'12px'}
                    />
                  )}

                  {displayName && (
                    <Box color={'white'} fontWeight={700} mt={'12px'}>
                      {displayName}
                    </Box>
                  )}
                </MotionFlex>

                <Box mt={'68px'} onClick={setOpenStatus.toggle}>
                  <MenuItems />
                </Box>
                <Box>
                  <StorageBar />
                </Box>

                <LogoutButton />
              </>
            )}
          </MotionFlex>
        )}
      </AnimatePresence>
    </MotionFlex>
  );
}

export default TopBar;

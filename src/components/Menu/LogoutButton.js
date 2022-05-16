import { Flex, Box, Tooltip, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import useSignOut from '../../hooks/useSignOut';
import { ReactComponent as SignOutIcon } from '../../images/icons/u_sign-out-alt.svg';
import {
  selectAuthenticationStatus,
  selectSidebarStatus,
} from '../../slices/user';

const LogoutButton = () => {
  const isOpen = useSelector(selectSidebarStatus);
  const { t } = useTranslation();
  const isAuthenticated = useSelector(selectAuthenticationStatus);
  const handleSignOut = useSignOut();

  return (
    <>
      {isAuthenticated ? (
        <Flex
          align={'center'}
          color={'white'}
          fontSize={'lg'}
          cursor={'pointer'}
          h={'80px'}
          px={isOpen ? '32px' : '24px'}
          mt={'auto'}
          onClick={handleSignOut}
        >
          <Tooltip
            isDisabled={isOpen}
            hasArrow
            shouldWrapChildren
            gutter={32}
            placement={'right'}
            label={t('Log out')}
            bg="#666666"
            color="white"
            sx={{
              '.chakra-tooltip__arrow': {
                bg: '#666666',
              },
            }}
          >
            <Box as={SignOutIcon} fill={'white'} />
          </Tooltip>

          {isOpen && (
            <Text variant={'body1'} color={'white'} mx={'12px'}>
              {t('Log out')}
            </Text>
          )}
        </Flex>
      ) : (
        <></>
      )}
    </>
  );
};

export default LogoutButton;

import {
  Box,
  Heading,
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectAuthenticationStatus } from '../../slices/user';

const AuthenticatedView = loadable(() => import('./AuthenticatedView'));
const UnauthenticatedView = loadable(() => import('./UnauthenticatedView'));

function Project() {
  const { t } = useTranslation();

  const [isAuthenticated] = [useSelector(selectAuthenticationStatus)];

  return (
    <Box flexGrow={1} py={'40px'}>
      <Heading fontSize={24} mb={'24px'}>
        {t('Project')}
      </Heading>

      {isAuthenticated ? <AuthenticatedView /> : <UnauthenticatedView />}
    </Box>
  );
}

export default Project;

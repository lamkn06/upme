import { useColorMode } from '@chakra-ui/react';
import loadable from '@loadable/component';
import React, { useEffect } from 'react';
import { setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TagManager from 'react-gtm-module';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { PROFILE_STATUS } from './slices/profile';
import {
  selectAuthenticationStatus,
  selectUserId,
  selectUserPage,
} from './slices/user';

const UserPage = loadable(() => import('./pages/UserPage'));
const HomePage = loadable(() => import('./pages/Home'));
const ResetPasswordPage = loadable(() => import('./pages/Reset'));
const LegalPage = loadable(() => import('./pages/Legal'));
const UserVerifyPage = loadable(() => import('./pages/UserVerify'));
const WelcomePage = loadable(() => import('./pages/Welcome'));

function App() {
  const { i18n } = useTranslation();
  const userId = useSelector(selectUserId);
  const profileStatus = useSelector((state) => state.profile?.profileStatus);
  const isAuthenticated = useSelector(selectAuthenticationStatus);
  const userPage = useSelector(selectUserPage);
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === 'dark') {
      toggleColorMode();
    }
  }, [colorMode, toggleColorMode]);

  useEffect(() => {
    // Datepicker default locale
    setDefaultLocale(i18n.language.substr(2));
  }, [i18n.language]);

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        user_id: userId,
      },
    });
  }, [userId]);

  return (
    <Switch>
      <Route path={'/reset/:token'}>
        {isAuthenticated ? <Redirect to={'/'} /> : <ResetPasswordPage />}
      </Route>

      <Route path={'/verify/:id/:token'}>
        {isAuthenticated ? <Redirect to={'/'} /> : <UserVerifyPage />}
      </Route>

      <Route path={'/legal/:page'}>
        <LegalPage />
      </Route>

      <Route path={'/welcome'}>
        {profileStatus === PROFILE_STATUS.OLD ? (
          <Redirect to={'/'} />
        ) : (
          <WelcomePage />
        )}
      </Route>
      
      <Route path={'/:page/projects/:projectId'}>
        <UserPage />
      </Route>

      <Route path={'/:page'}>
        <UserPage />
      </Route>


      <Route path={'/'}>
        {profileStatus === PROFILE_STATUS.NEW ? (
          <Redirect to={'/welcome'} />
        ) : userPage ? (
          <Redirect to={`/${userPage}`} />
        ) : (
          <HomePage />
        )}
      </Route>

      <Redirect to={'/'} />
    </Switch>
  );
}

export default App;

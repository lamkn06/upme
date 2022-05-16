import { useCallback } from 'react';
import { useGoogleLogout } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { resetProfile } from '../slices/profile';
import { resetUser } from '../slices/user';

function useSignOut() {
  const { FB } = window;
  const dispatch = useDispatch();
  const history = useHistory();
  const { signOut: googleSignOut } = useGoogleLogout({
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  });
  return useCallback(() => {
    googleSignOut();
    FB?.logout();
    localStorage.clear();
    sessionStorage.clear();
    dispatch(resetUser());
    dispatch(resetProfile());
    history.push('/welcome');
  }, [FB, dispatch, googleSignOut, history]);
}

export default useSignOut;

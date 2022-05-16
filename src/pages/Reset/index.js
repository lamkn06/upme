import { useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setProfile, PROFILE_STATUS } from '../../slices/profile';

function ResetPasswordPage() {
  const { token } = useParams();
  const dispatch = useDispatch();
  useEffect(
    function resetProfileStatus() {
      dispatch(setProfile({
        profileStatus: PROFILE_STATUS.NEW
      }))
    },
  [dispatch])
  
  return (
    <Redirect to={{
      pathname: '/welcome',
      state: { token }
    }}
    />
  )
}

export default ResetPasswordPage;

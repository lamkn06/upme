import {
  Center,
  Modal,
  ModalOverlay,
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { verifyAccount } from '../../slices/user';

const VerifyFailedModal = loadable(() => import('./VerifyFailedModal'));
const VerifySuccessModal = loadable(() => import('./VerifySuccessModal'));

function UserVerifyPage() {
  const { id, token } = useParams();
  const history = useHistory();
  const [verifyStatus, setVerifyStatus] = useState('idle');
  const [errMessage, setErrMessage] = useState('');
  const dispatch = useDispatch();
  useEffect(
    function resetProfileStatus() {
      dispatch(verifyAccount({
        id, token
      }))
      .unwrap()
      .then((res) => {
        setVerifyStatus('success');
      })
      .catch((err) => {
        setVerifyStatus('failed');
        if (err.error) {
          setErrMessage(err.error);
        } else setErrMessage('Error');

      });
    },
  [dispatch, id, token]);

  const onClose = () => {
    history.push('/welcome');
  }
  
  return (
    <Center flexDir={'column'} minH={'100vh'} overflow={'hidden'}>
      <Modal isCentered isOpen>
          <ModalOverlay />
          {verifyStatus === 'success' && (
            <VerifySuccessModal onClose={onClose} />
          )}
          {verifyStatus === 'failed' && (
            <VerifyFailedModal onClose={onClose} errMessage={errMessage} />
          )}
      </Modal>
    </Center>
  )
}

export default UserVerifyPage;

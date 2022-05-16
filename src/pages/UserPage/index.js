import loadable from '@loadable/component';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { selectUserPage, selectPublicViewStatus } from '../../slices/user';
import { setProjectToView } from '../../slices/project';

const HomePage = loadable(() => import('../Home'));
const PublicView = loadable(() => import('../PublicView'));

function UserPage() {
  const { page: urlPage, projectId } = useParams();
  const userPage = useSelector(selectUserPage);
  const publicViewStatus = useSelector(selectPublicViewStatus);
  const [pageToLoad, setPageToLoad] = useState('publicView');
  const dispatch = useDispatch();

  useEffect(() => {
    if (publicViewStatus) {
      document.title = 'Upme - Public view';
    } else {
      document.title = 'Upme';
    }
  }, [publicViewStatus]);

  useEffect(() => {
    if (urlPage === userPage) {
      // User is logged in and enter urlPage for the 1st time
      setPageToLoad(publicViewStatus ? 'publicView' : 'editView');
    } else {
      // When urlPage is different with userPage, go to publicView
      setPageToLoad('publicView');
    }
  }, [urlPage, userPage, publicViewStatus]);

  useEffect(() => {
    if (projectId !== undefined) {
      dispatch(setProjectToView(projectId));
    }
  },
  [dispatch, projectId])

  return pageToLoad === 'publicView' ? <PublicView /> : <HomePage />;
}

export default UserPage;

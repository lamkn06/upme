import { Box, Flex, useBoolean } from '@chakra-ui/react';
import { ReactComponent as UpArrow } from '../../../images/icons/u_arrow-up.svg';
import React, { useCallback } from 'react';
import {
  changeTemporaryThumbnail,
  uploadThumbnailForNewProject,
} from '../../../slices/project';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { checkExceedCapacity } from '../../../utils/projectUtils';
import { selectAvailableCapacity } from '../../../slices/user';
import loadable from '@loadable/component';

const ExceedCapacityModal = loadable(() => import('./ExceedCapacityModal'));

const ThumbnailDropzone = ({
  project,
  onChangeThumbnail,
  currentThumbnail,
  title,
}) => {
  const dispatch = useDispatch();
  const availableCapacity = useSelector(selectAvailableCapacity);
  const [displayExceedCapacity, toggleDisplayExceedCapacity] =
    useBoolean(false);

  const onDrop = useCallback(
    (files) => {
      if (checkExceedCapacity(files, availableCapacity)) {
        toggleDisplayExceedCapacity.toggle();
        return;
      }

      // Check if currentThumbnail is not thumbnailDefault
      let currentThumbnailToDelete = null;

      if (project.thumbnailDefault !== currentThumbnail) {
        currentThumbnailToDelete = currentThumbnail;
      }

      dispatch(
        uploadThumbnailForNewProject({
          file: files[0],
          currentThumbnail: currentThumbnailToDelete,
        })
      )
        .unwrap()
        .then((res) => {
          dispatch(changeTemporaryThumbnail(res.data.thumbnail));
          onChangeThumbnail(res.data.thumbnail);
        });
    },
    [
      availableCapacity,
      currentThumbnail,
      dispatch,
      onChangeThumbnail,
      project?.thumbnailDefault,
      toggleDisplayExceedCapacity,
    ]
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    multiple: false,
    onDrop,
  });

  return (
    <Flex
      {...getRootProps()}
      align={'center'}
      color={'primary'}
      cursor={'pointer'}
      mt={'16px'}
      w={'fit-content'}
      spacing={'4px'}
    >
      <input {...getInputProps()} />
      <Box>{title}</Box>
      <Box as={UpArrow} fill={'primary'} ms={'4px'} />
      <ExceedCapacityModal
        isOpen={displayExceedCapacity}
        onClose={toggleDisplayExceedCapacity.toggle}
      />
    </Flex>
  );
};

export default ThumbnailDropzone;

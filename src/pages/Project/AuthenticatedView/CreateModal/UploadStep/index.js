import { useBoolean } from '@chakra-ui/react';
import loadable from '@loadable/component';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  changeUploadedFiles, processDeleteUploadedFile, selectUploadedFiles
} from '../../../../../slices/project';

const UploadContentModal = loadable(() => import('./UploadContentModal'));
const ExceedCapacityModal = loadable(() => import('../../ExceedCapacityModal'));
const SortableContainer = loadable(() => import('../../../component/DnDSortable/SortableContainer'));

function UploadStep({ onChangeStep, onClose }) {
  const dispatch = useDispatch();
  const uploadedFiles = useSelector(selectUploadedFiles);
  const [displayExceedCapacity, toggleDisplayExceedCapacity] =
    useBoolean(false);
  const onContinue = () => onChangeStep(true);
  const onDeleteUploadedFile = useCallback(
    (file, idx) => {
      dispatch(processDeleteUploadedFile(file, idx));
    },
    [dispatch]
  );

  const setUploadedFiles = (sortFileFunc) => {
    const newArr = sortFileFunc(uploadedFiles);
    dispatch(changeUploadedFiles(newArr));
  }

  return (
    <>
      <UploadContentModal
        uploadedFiles={uploadedFiles}
        onExceedCapacity={toggleDisplayExceedCapacity.toggle}
        isOpen={true}
        onClose={onClose}
        onContinue={onContinue}
      >
        <SortableContainer
          items={uploadedFiles}
          setItems={setUploadedFiles}
          itemAction={{
            onDeleteFile: onDeleteUploadedFile
          }}
        />
      </UploadContentModal>

      <ExceedCapacityModal
        isOpen={displayExceedCapacity}
        onClose={toggleDisplayExceedCapacity.toggle}
      />
    </>
  );
}

export default UploadStep;

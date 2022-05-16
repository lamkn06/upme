import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import loadable from '@loadable/component';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { handleCloseNewProjectModal } from '../../../../slices/project';

const CreateStep = loadable(() => import('./CreateStep'));
const UploadStep = loadable(() => import('./UploadStep'));

function CreateModal({ isOpen, onClose }) {
  const [step, setStep] = useState(false);
  const dispatch = useDispatch();

  const onCloseNewProjectModal = () => {
    setStep(false);
    dispatch(handleCloseNewProjectModal());
    onClose();
  };

  return (
    <Modal
      isCentered
      closeOnEsc={false}
      closeOnOverlayClick={false}
      scrollBehavior={'inside'}
      isOpen={isOpen}
      onClose={onCloseNewProjectModal}
    >
      <ModalOverlay />
      <ModalContent
        maxW={'960px'}
        rounded={2}
        sx={{
          '*::-webkit-scrollbar': {
            w: '0 !important',
          },
        }}
      >
        {step ? (
          <CreateStep onChangeStep={setStep} onClose={onCloseNewProjectModal} />
        ) : (
          <UploadStep onChangeStep={setStep} onClose={onCloseNewProjectModal} />
        )}
      </ModalContent>
    </Modal>
  );
}

export default CreateModal;

import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
  Heading
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ReactCrop from 'react-image-crop';
import { selectSidebarStatus, selectSidebarVisible } from '../../slices/user';
import 'react-image-crop/dist/ReactCrop.css';

function ProfilePictureModal({ isOpen, onClose, src, onCancel, onComplete }) {
  const { t } = useTranslation();
  const [imageRef, setImageRef] = useState(null);
  const isSideBarOpen = useSelector(selectSidebarStatus);
  const marginLeft = useBreakpointValue([0, isSideBarOpen ? '260px' : '72px']);
  const isSideBarVisible = useSelector(selectSidebarVisible);
  const [crop, setCrop] = useState({
    aspect: 4 / 4,
    unit: 'px',
    width: 112,
    height: 112,
  });

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent
        minH={'382px'}
        maxW="578px"
        boxShadow={'0px 1px 0px 0px #00000040'}
        ml={isSideBarVisible ? marginLeft : 0}
      >
        <ModalHeader p={'16px 24px'}>
          <Heading variant={'h5'}>
            {t('Profile Picture')}
          </Heading>

          <ModalCloseButton
            boxSize={'22px'}
            top={'16px'}
            right={'24px'}
            _focus={{}}
          />
        </ModalHeader>
        <Divider />

        <ModalBody
          p={'24px'}
          sx={{
            '.ReactCrop__crop-selection': {
              borderImageSlice: 'unset',
              '.ReactCrop__drag-handle::after': {
                backgroundColor: 'rgba(255, 255, 255, 0.45)',
              },
            },
          }}
        >
          <ReactCrop
            src={src}
            crop={crop}
            minHeight={112}
            minWidth={112}
            maxHeight={334}
            maxWidth={334}
            keepSelection
            onImageLoaded={(image) => {
              setImageRef(image);
            }}
            onChange={(crop) => {
              setCrop(crop);
            }}
          />
        </ModalBody>

        <ModalFooter justifyContent={'space-between'} p={'0 24px 24px'}>
          <Button
            variant={'secondary'}
            w={'130px'}
            onClick={() => {
              onCancel();
              onClose();
            }}
          >
            {t('Cancel')}
          </Button>

          <Button
            variant={'primary'}
            w={'157px'}
            onClick={() => {
              if (imageRef) {
                const canvas = document.createElement('canvas');
                const scaleX = imageRef.naturalWidth / imageRef.width;
                const scaleY = imageRef.naturalHeight / imageRef.height;
                canvas.width = crop.width;
                canvas.height = crop.height;
                const ctx = canvas.getContext('2d');

                ctx.drawImage(
                  imageRef,
                  crop.x * scaleX,
                  crop.y * scaleY,
                  crop.width * scaleX,
                  crop.height * scaleY,
                  0,
                  0,
                  crop.width,
                  crop.height
                );

                canvas.toBlob((blob) => {
                  if (!blob) {
                    console.error('Canvas is empty');
                  } else {
                    onComplete(blob);
                    onClose();
                  }
                }, 'image/jpeg');
              }
            }}
          >
            {t('Crop & Save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
ProfilePictureModal.propTypes = ProfilePictureModal.props;
export default ProfilePictureModal;

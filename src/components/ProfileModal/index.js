import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  chakra,
  useBreakpointValue,
  Heading,
  Text,
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectSidebarStatus, selectSidebarVisible } from '../../slices/user';
import AvatarPlaceholder from '../../images/avatar-placeholder.svg';
import {
  selectProfile,
  setProfile,
  uploadProfileImage,
  updateProfile,
} from '../../slices/profile';

const ProfilePictureModal = loadable(() => import('./ProfilePictureModal'));

function ProfileModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const [triggerSave, setTriggerSave] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [image, setImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const isSideBarOpen = useSelector(selectSidebarStatus);
  const marginLeft = useBreakpointValue([0, isSideBarOpen ? '260px' : '72px']);
  const isSideBarVisible = useSelector(selectSidebarVisible);
  const {
    isOpen: isProfilePictureOpen,
    onOpen: onProfilePictureOpen,
    onClose: onProfilePictureClose,
  } = useDisclosure();
  const initForm = useMemo(
    () => ({
      defaultValues: {
        displayName: localStorage.getItem('displayName') || profile.displayName,
      },
    }),
    [profile.displayName]
  );
  const {
    register,
    reset,
    formState: { isDirty },
    handleSubmit,
  } = useForm(initForm);

  const onSubmit = async (data) => {
    const newProfileData = {};
    if (isDirty) {
      localStorage.setItem('displayName', data.displayName);
      newProfileData.displayName = data.displayName;
    }

    if (avatar) {
      const formData = new FormData();
      formData.append('profilePicture', avatar);
      newProfileData.profilePicture = await dispatch(
        uploadProfileImage(formData)
      ).unwrap();
    }

    dispatch(setProfile(newProfileData));
    setTriggerSave(true);
    onClose();
  };
  const onError = () => {
    onClose();
  };

  const deleteAvatar = () => {
    dispatch(setProfile({ profilePicture: false }));
    setAvatar(null);
  };

  useEffect(() => {
    if (triggerSave) {
      dispatch(updateProfile(profile));
      setTriggerSave(false);
    }
  }, [dispatch, profile, triggerSave]);

  useEffect(
    function resetData() {
      if (isOpen === true) {
        setAvatar(null);
        setUploadError(null);
        reset({ ...initForm.defaultValues });
      }
    },
    [initForm, isOpen, reset]
  );

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent
          minH={'339px'}
          maxW={'451px'}
          ml={isSideBarVisible ? marginLeft : 0}
        >
          <ModalHeader p={'16px 24px'}>
            <Heading variant={'h5'}>{t('Profile')}</Heading>

            <ModalCloseButton
              boxSize={'22px'}
              top={'16px'}
              right={'24px'}
              _focus={{}}
              _hover={{}}
            />
          </ModalHeader>

          <Divider />

          <ModalBody p={0}>
            <Flex align={'center'} px={'24px'} pt={'24px'} pb={uploadError ? '12px' : '24px'}>
              <Image
                src={
                  avatar
                    ? window.URL.createObjectURL(avatar)
                    : profile.profilePicture
                }
                fallbackSrc={AvatarPlaceholder}
                fit={'cover'}
                borderRadius={24}
                boxSize={112}
                minW={112}
                p={avatar || profile.profilePicture ? 0 : '12px 12px 0'}
              />
              <Box h={'40px'} w={'153px'} ml={'24px'} mr={'16px'}>
                <chakra.label
                  for={'uploadFileInput'}
                  layerStyle={'labelButtonPrimary'}
                  textStyle={'buttonPrimary'}
                >
                  {t('Upload now')}
                </chakra.label>
                <Input
                  id={'uploadFileInput'}
                  type={'file'}
                  display={'none'}
                  accept={'.png, .jpg, .jpeg'}
                  onClick={(e) => {
                    e.target.value = '';
                  }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const inputElement =
                        document.getElementById('uploadFileInput');
                      const fileName = inputElement.value;
                      const idxDot = fileName.lastIndexOf('.') + 1;
                      const extFile = fileName
                        .substr(idxDot, fileName.length)
                        .toLowerCase();
                      if (
                        extFile === 'jpg' ||
                        extFile === 'jpeg' ||
                        extFile === 'png'
                      ) {
                        setUploadError(null);
                        const reader = new FileReader();
                        reader.addEventListener('load', () => {
                          setImage(reader.result);
                          onProfilePictureOpen();
                        });
                        reader.readAsDataURL(e.target.files[0]);
                      } else {
                        setUploadError(
                          t('Only jpg/jpeg and png files are allowed!')
                        );
                      }
                    }
                  }}
                />
              </Box>

              <Button
                variant={'secondary'}
                w={'106px'}
                _hover={{ bg: '#fcfcfc' }}
                onClick={deleteAvatar}
              >
                {t('Delete')}
              </Button>
            </Flex>

            {uploadError && (
              <Box maxW={120} ml={'24px'}>
              <Text pb={'24px'} color={'red'} fontSize={'sm'}>
                {uploadError}
              </Text>
              </Box>
            )}

            <FormControl id="displayName" px={'24px'}>
              <FormLabel mb={'4px'}>{t('Display Name')}</FormLabel>

              <Input
                {...register('displayName')}
                h={'48px'}
                placeholder="eg. Captain America"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter justifyContent={'space-between'} pt={'40px'} pb={'24px'}>
            <Button
              variant={'secondary'}
              w={'130px'}
              _hover={{ bg: '#fcfcfc' }}
              onClick={onClose}
            >
              {t('Cancel')}
            </Button>

            <Button
              variant={'primary'}
              w={'119px'}
              onClick={handleSubmit(onSubmit, onError)}
            >
              {t('Save')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ProfilePictureModal
        isOpen={isProfilePictureOpen}
        onClose={() => {
          onProfilePictureClose();
          setImage(null);
        }}
        src={image}
        onCancel={() => {
          setImage(null);
        }}
        onComplete={setAvatar}
      />
    </>
  );
}
ProfileModal.propTypes = ProfileModal.props;
export default ProfileModal;

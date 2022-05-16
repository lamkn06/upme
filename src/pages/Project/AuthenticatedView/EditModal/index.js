import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack, IconButton, Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer, Spinner, Tag,
  TagCloseButton,
  TagLabel,
  Textarea, useBoolean, useDisclosure, useToast
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import React, { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ImageIcon from '../../../../images/assets/image.png';
import Placeholder from '../../../../images/assets/upload-placeholder.png';
import { ReactComponent as UpArrow } from '../../../../images/icons/u_arrow-up.svg';
import { ReactComponent as CalendarIcon } from '../../../../images/icons/u_calendar-alt.svg';
import { ReactComponent as TrashIcon } from '../../../../images/icons/u_trash-alt.svg';
import {
  deleteFile,
  deleteFileOnEditingProject, deleteProject, handleCloseEditProjectModal, processDeleteUploadedFile,
  removeNewlyUploadedFilesAndThumbnail,
  selectThumbnailUploadStatus, selectUploadedFiles,
  updateProject, uploadFile
} from '../../../../slices/project';
import { selectAvailableCapacity } from '../../../../slices/user';
import { checkExceedCapacity } from '../../../../utils/projectUtils';

const ThumbnailDropzone = loadable(() => import('../ThumbnailDropzone'));
const ExceedCapacityModal = loadable(() => import('../ExceedCapacityModal'));
const DeleteConfirmationModal = loadable(() =>
  import('../DeleteConfirmationModal/index')
);
const SortableContainer = loadable(() => import('../../component/DnDSortable/SortableContainer'));

const EditModal = ({ project, isOpen, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    onOpen: onOpenConfirmDeleteProjectModal,
    onClose: onCloseConfirmDeleteProjectModal,
    isOpen: isOpenConfirmDeleteProjectModal,
  } = useDisclosure();
  const {
    onOpen: onOpenConfirmDeleteProjectFileModal,
    onClose: onCloseConfirmDeleteProjectFileModal,
    isOpen: isOpenConfirmDeleteProjectFileModal,
  } = useDisclosure();
  const {
    onOpen: onOpenConfirmDeleteUploadedFileModal,
    onClose: onCloseConfirmDeleteUploadedFileModal,
    isOpen: isOpenConfirmDeleteUploadedFileModal,
  } = useDisclosure();

  const [loading, setLoading] = useState(false);

  // Origin file from project
  const [projectFiles, setProjectFiles] = useState(project?.files || []);

  // Stored project files to remove when hit save
  const [removedFiles, setProjectRemovedFiles] = useState([]);
  const [removeFileIdx, setRemoveFileIdx] = useState(null);

  // thumbnail state to store the uploaded thumbnail
  const [thumbnail, setThumbnail] = useState();

  // defaultThumbNail state to store the Project's thumbnailDefault
  const [defaultThumbnail, setDefaultThumbnail] = useState(
    project?.thumbnailDefault
  );

  const [tags, setTags] = useState(project?.tags.map((i) => i.label) || []);

  const isUploadingThumbnail = useSelector(selectThumbnailUploadStatus);
  const availableCapacity = useSelector(selectAvailableCapacity);

  // Expect this always updated with the newly uploaded files
  const uploadedFiles = useSelector(selectUploadedFiles);

  const [combinedFiles, setCombinedFiles] = useState([...projectFiles.map(file => { return {...file, isProjectFile: true}})
  ]);

  useEffect(() => {
    // Add newly uploaded file to combinedFiles 
    if (uploadedFiles.length + projectFiles.length > combinedFiles.length) {
      setCombinedFiles([uploadedFiles[uploadedFiles.length-1], ...combinedFiles]);
    }
  }, [uploadedFiles])

  const [displayExceedCapacity, toggleDisplayExceedCapacity] =
    useBoolean(false);

  const onDrop = useCallback(
    async (files) => {
      if (checkExceedCapacity(files, availableCapacity)) {
        toggleDisplayExceedCapacity.toggle();
        return;
      }

      setLoading(true);
      await Promise.all(
        files.map(async (file) => await dispatch(uploadFile(file)))
      );
      setLoading(false);
    },
    [availableCapacity, dispatch, toggleDisplayExceedCapacity]
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept:
      'image/*, audio/*, video/MPEG-4, video/mpeg-4, video/mp4, video/MP4, video/quicktime',
    onDrop,
  });

  const toast = useToast({
    position: 'bottom-right',
    isClosable: true,
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      projectName: project?.name,
      completedOn: project?.dateCompleted
        ? new Date(project.dateCompleted)
        : null,
      projectLink: project?.link,
      description: project?.description,
    },
  });
  const onSubmit = (data) => {
    removedFiles.forEach((fileObj) => {
      dispatch(
        deleteFileOnEditingProject({
          projectId: project._id,
          ...fileObj,
        })
      );
    });

    dispatch(
      updateProject({
        id: project._id,
        name: data.projectName,
        dateCompleted: data.completedOn,
        link: data.projectLink,
        description: data.description,
        tags,
        thumbnailDefault: thumbnail || defaultThumbnail,
        files: [...combinedFiles],
      })
    ).then(() => {
      toast({
        title: t('Congratulation'),
        description: t('ProjectUpdateSuccess'),
        status: 'success',
      });
      onClose();
    });
  };

  const onCloseEditProjectModal = useCallback(() => {
    dispatch(handleCloseEditProjectModal());
    onClose();
  }, [dispatch, onClose]);

  const onDeleteProjectFile = (file, idx) => {
    setRemoveFileIdx(idx);
    onOpenConfirmDeleteProjectFileModal();
  };

  const handleDeleteProjectFile = async () => {
    // temporary store project removed files in state projectRemovedFiles
    const newList = [...combinedFiles];
    const newRemovedList = [...removedFiles];
    const fileToRemove = newList.splice(removeFileIdx, 1);
    newRemovedList.push(...fileToRemove);
    setCombinedFiles(newList);
    setProjectRemovedFiles(newRemovedList);
    setRemoveFileIdx(null); // reset index
  };

  const onDeleteUploadedFile = useCallback(
    (file, idx) => {
      setRemoveFileIdx(idx);
      onOpenConfirmDeleteUploadedFileModal();
    },
    [onOpenConfirmDeleteUploadedFileModal]
  );

  const handleDeleteUploadedFile = useCallback(async () => {
    // Temporary store project removed files in state projectRemovedFiles
    const newList = [...combinedFiles];
    const fileToRemove = newList.splice(removeFileIdx, 1);
    dispatch(processDeleteUploadedFile(...fileToRemove, removeFileIdx));
    setRemoveFileIdx(null); // reset index
    setCombinedFiles(newList);
  }, [dispatch, removeFileIdx, uploadedFiles]);

  const onDeleteFile = (file, idx) => {
    if (file.isProjectFile) {
      onDeleteProjectFile(file, idx);
    } else onDeleteUploadedFile(file, idx);
  }

  const handleOnCloseDeleteFileConfirmationModal = useCallback(() => {
    setRemoveFileIdx(null); // reset remove file index
    onCloseConfirmDeleteProjectFileModal();
  }, [onCloseConfirmDeleteProjectFileModal]);

  const handleOnCloseDeleteUploadedFileConfirmationModal = useCallback(() => {
    setRemoveFileIdx(null); // reset remove file index
    onCloseConfirmDeleteUploadedFileModal();
  }, [onCloseConfirmDeleteUploadedFileModal]);

  const onSetThumbnail = (newThumbnail) => {
    setThumbnail(newThumbnail);

    // We don't need default thumbnail anymore when a new thumbnail is uploaded
    setDefaultThumbnail(null);
  };

  const deleteThumbnail = useCallback(() => {
    if (defaultThumbnail !== null) {
      // If remove Default Thumbnail, temporary set to null
      setDefaultThumbnail(null);
      return;
    }

    dispatch(deleteFile({ thumbnail }));
    setThumbnail(null);
  }, [defaultThumbnail, dispatch, thumbnail]);

  const handleDeleteProject = useCallback(() => {
    // Remove Uploaded file and Thumbnail when delete project
    dispatch(removeNewlyUploadedFilesAndThumbnail());

    dispatch(deleteProject(project._id))
      .unwrap()
      .then(() => {
        toast({
          title: t('Congratulation'),
          description: t('DeleteProjectSuccess'),
          status: 'success',
        });
      })
      .catch(() => {
        toast({
          title: t('Congratulation'),
          description: t('DeleteProjectError'),
          status: 'error',
        });
      })
      .finally(() => {
        onCloseEditProjectModal();
      });
  }, [dispatch, onCloseEditProjectModal, project?._id, t, toast]);

  return (
    <Modal
      isCentered
      closeOnEsc={false}
      closeOnOverlayClick={false}
      scrollBehavior={'inside'}
      isOpen={isOpen}
      onClose={onCloseEditProjectModal}
    >
      <ModalOverlay />

      <ModalContent
        maxW={['auto', '1225px']}
        rounded={2}
        sx={{
          '*::-webkit-scrollbar': {
            w: '0 !important',
          },
        }}
      >
        <ModalHeader
          boxShadow={'0px 1px 0px rgba(0, 0, 0, 0.25)'}
          fontSize={24}
          fontWeight={'bold'}
          h={'56px'}
          py={'12px'}
        >
          {t('EditProject')}
        </ModalHeader>

        <ModalCloseButton top={'14px'} />

        <ModalBody p={0}>
          <Flex direction={['column', 'row']}>
            <Flex
              align={'center'}
              borderRight={'1px solid #DBE1E6'}
              flexDir={'column'}
              maxH={'996px'}
              minW={['100vw', '764px']}
              overflowY={'auto'}
              p={'24px'}
            >
              <input {...getInputProps()} />

              <Image src={ImageIcon} boxSize={'48px'} mb={'6px'} />

              <Box fontSize={16}>{t('UploadYourFileHere')}</Box>

              <HStack
                {...getRootProps()}
                color={'primary'}
                cursor={'pointer'}
                spacing={'4px'}
              >
                <Box>{t('Browse')}</Box>
                <Box as={UpArrow} fill={'primary'} />
              </HStack>

              {loading && (
                <Box>
                  <Spinner boxSize={'24px'} mt={'24px'} />
                </Box>
              )}
              <SortableContainer
                items={combinedFiles}
                setItems={setCombinedFiles}
                itemAction={{
                  onDeleteFile
                }}
              />
            </Flex>

            <Flex flexDir={'column'} minW={['100vw', '460px']} p={'24px'}>
              <Box fontWeight={500}>{t('ProjectThumbnail')}</Box>
              <Box pos={'relative'} mt={'4px'}>
                <Image
                  src={thumbnail || defaultThumbnail}
                  fallbackSrc={Placeholder}
                  h={'224px'}
                  mx={'auto'}
                />

                {isUploadingThumbnail && (
                  <Spinner
                    pos={'absolute'}
                    top={'calc(50% - (1.5rem/2))'}
                    left={'calc(50% - (1.5rem/2))'}
                  />
                )}

                {(thumbnail || defaultThumbnail) && (
                  <IconButton
                    aria-label={'Delete thumbnail'}
                    icon={
                      <Box
                        as={TrashIcon}
                        boxSize={'12px'}
                        fill={'#3F4647'}
                        w={'12px'}
                      />
                    }
                    colorScheme="gray"
                    boxSize={'28px'}
                    minW={'auto'}
                    pos={'absolute'}
                    top={'8px'}
                    right={'8px'}
                    rounded={'full'}
                    onClick={deleteThumbnail}
                  />
                )}
              </Box>

              <ThumbnailDropzone
                project={project}
                currentThumbnail={thumbnail}
                onChangeThumbnail={onSetThumbnail}
                title={
                  thumbnail || defaultThumbnail
                    ? t('EditThumbnail')
                    : t('UploadThumbnail')
                }
              />

              <Flex flexDir={'column'} mt={'24px'} sx={{ gap: '16px' }}>
                <FormControl isRequired isInvalid={errors.projectName}>
                  <FormLabel mb={'2px'} _invalid={{ color: '#E53E3E' }}>
                    {t('ProjectName')}
                  </FormLabel>
                  <Input
                    {...register('projectName', {
                      required: 'ProjectNameRequired',
                    })}
                  />
                  <FormErrorMessage mt={'4px'}>
                    {errors.projectName && t(errors.projectName.message)}
                  </FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel mb={'2px'}>{t('CompletedOn')}</FormLabel>
                  <Controller
                    render={({ field: { value, onChange } }) => (
                      <InputGroup
                        sx={{
                          '.react-datepicker-wrapper': {
                            w: '100%',
                          },
                          '.react-datepicker-popper': {
                            zIndex: 2,
                          },
                          '.react-datepicker__day--keyboard-selected': {
                            bg: '#06DCFF',
                            _hover: {
                              bg: '#06DCFF',
                            },
                          },
                          '.react-datepicker__month-select': {
                            _focusVisible: {
                              outlineColor: '#06DCFF',
                            },
                          },
                          '.react-datepicker__year-select': {
                            _focusVisible: {
                              outlineColor: '#06DCFF',
                            },
                          },
                        }}
                      >
                        <Input
                          autoComplete={'off'}
                          borderRadius={2}
                          h={'48px'}
                          as={DatePicker}
                          dateFormat="dd/MM/yyyy"
                          showPopperArrow={false}
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode={'select'}
                          selected={value}
                          onChange={(date) => {
                            onChange(date);
                          }}
                        />
                        <InputRightElement
                          h={'48px'}
                          children={<CalendarIcon fill={'#C8CFD3'} />}
                        />
                      </InputGroup>
                    )}
                    name={'completedOn'}
                    control={control}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel mb={'2px'}>{t('LinkToFullProject')}</FormLabel>
                  <Input {...register('projectLink')} />
                </FormControl>

                <FormControl>
                  <FormLabel mb={'2px'}>{t('Tags')}</FormLabel>
                  <Flex
                    align={'center'}
                    border={'1px solid #e2e8f0'}
                    maxW={'682px'}
                    p={'16px'}
                    wrap={'wrap'}
                    sx={{ gap: '8px' }}
                  >
                    {tags.map((i) => (
                      <Tag
                        key={i}
                        bg={'rgba(6, 220, 255, 0.1)'}
                        rounded={0}
                        zIndex={1}
                      >
                        <TagLabel>{i}</TagLabel>
                        <TagCloseButton
                          onClick={() => setTags(tags.filter((t) => t !== i))}
                        />
                      </Tag>
                    ))}
                    <Input
                      variant={'ghost'}
                      flex={1}
                      my={'-16px'}
                      minW={'50px'}
                      px={'0'}
                      onKeyPress={(event) => {
                        if (['Enter', 'Space'].indexOf(event.code) > -1) {
                          if (!tags.find((i) => i === event.target.value)) {
                            setTags([...tags, event.target.value]);
                          }
                          event.target.value = '';
                        }
                      }}
                      onBlur={(event) => {
                        if (!tags.find((i) => i === event.target.value)) {
                          setTags([...tags, event.target.value]);
                        }
                        event.target.value = '';
                      }}
                    />
                  </Flex>
                </FormControl>

                <FormControl mb={'24px'}>
                  <FormLabel mb={'2px'}>{t('Description')}</FormLabel>
                  <Textarea {...register('description')} resize={'none'} />
                </FormControl>
              </Flex>

              <Flex mt={'auto'}>
                <Button
                  variant={'secondary'}
                  h={'48px'}
                  minW={'120px'}
                  onClick={onOpenConfirmDeleteProjectModal}
                >
                  {t('Delete')}
                </Button>
                <Spacer />
                <Button
                  variant={'primary'}
                  h={'48px'}
                  minW={'120px'}
                  onClick={handleSubmit(onSubmit)}
                  disabled={
                    projectFiles.length === 0 && uploadedFiles.length === 0
                  }
                >
                  {t('Save')}
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>

      <ExceedCapacityModal
        isOpen={displayExceedCapacity}
        onClose={toggleDisplayExceedCapacity.toggle}
      />
      <DeleteConfirmationModal
        isOpen={isOpenConfirmDeleteUploadedFileModal}
        onClose={handleOnCloseDeleteUploadedFileConfirmationModal}
        onConfirm={handleDeleteUploadedFile}
      />
      <DeleteConfirmationModal
        isOpen={isOpenConfirmDeleteProjectFileModal}
        onClose={handleOnCloseDeleteFileConfirmationModal}
        onConfirm={handleDeleteProjectFile}
      />
      <DeleteConfirmationModal
        isOpen={isOpenConfirmDeleteProjectModal}
        onClose={onCloseConfirmDeleteProjectModal}
        onConfirm={handleDeleteProject}
      />
    </Modal>
  );
};

export default EditModal;

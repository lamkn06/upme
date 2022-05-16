import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalFooter,
  Spacer,
  Tag,
  TagCloseButton,
  TagLabel,
  Textarea,
  useToast,
  ModalHeader,
  ModalCloseButton,
  IconButton,
  Spinner,
  Center,
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Placeholder from '../../../../images/assets/upload-placeholder.png';
import { ReactComponent as CalendarIcon } from '../../../../images/icons/u_calendar-alt.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProject,
  selectUploadedFiles,
  selectTempProjectData,
  changeTempProjectData,
  deleteFile,
  selectThumbnailUploadStatus,
} from '../../../../slices/project';

import { ReactComponent as TrashIcon } from '../../../../images/icons/u_trash-alt.svg';
import TagManager from 'react-gtm-module';
import { selectTotalCapacity, selectUserId } from '../../../../slices/user';

const ThumbnailDropzone = loadable(() => import('../ThumbnailDropzone'));

function CreateStep({ onChangeStep, onClose }) {
  const { t } = useTranslation();
  const toast = useToast({
    position: 'bottom-right',
    isClosable: true,
  });
  const dispatch = useDispatch();
  const uploadedFiles = useSelector(selectUploadedFiles);
  const isUploadingThumbnail = useSelector(selectThumbnailUploadStatus);
  const userId = useSelector(selectUserId);
  const totalStorageCapacity = useSelector(selectTotalCapacity);
  const [tags, setTags] = useState([]);

  // thumbnail state to store the uploaded thumbnail
  const [thumbnail, setThumbnail] = useState(null);

  // defaultThumbNail state to store the thumbnail from 1st uploaded file
  const [defaultThumbnail, setDefaultThumbnail] = useState();
  const {
    control,
    formState: { errors, isDirty },
    handleSubmit,
    register,
    watch,
    reset,
  } = useForm();
  const requestForm = watch();
  const projectType = useMemo(() => {
    const hasImage = uploadedFiles.some((i) => i.originalType === 0);
    const hasVideo = uploadedFiles.some((i) => i.originalType === 1);

    if (hasImage && !hasVideo) {
      return 'Image';
    }
    if (!hasImage && hasVideo) {
      return 'Video';
    }
    if (hasImage && hasVideo) {
      return 'Mixed';
    }
    return 'Default';
  }, [uploadedFiles]);
  const onSubmit = (data) => {
    dispatch(
      createProject({
        name: data.projectName,
        dateCompleted: data.completedOn,
        link: data.projectLink,
        description: data.description,
        tags,
        thumbnailDefault: thumbnail || defaultThumbnail,
        files: uploadedFiles,
      })
    )
      .unwrap()
      .then(() => {
        toast({
          title: t('Congratulation'),
          description: t('Your project has been created'),
          status: 'success',
        });
        onClose();
        TagManager.dataLayer({
          dataLayer: {
            event: 'create_project',
            user_type: 'Free',
            user_id: userId,
            project_type: projectType,
            total_storage: totalStorageCapacity,
          }
        });
      });
  };

  const onSetThumbnail = (newThumbnail) => {
    setThumbnail(newThumbnail);

    // We don't need default thumbnail anymore when a new thumbnail is uploaded
    setDefaultThumbnail(null);
  };

  const deleteThumbnail = () => {
    if (defaultThumbnail !== null) {
      // Remove defaultThumbnail from 1st uploaded file
      setDefaultThumbnail(null);
      return;
    }
    // Call API to remove uploaded thumbnail
    dispatch(deleteFile({ thumbnail }));
    setThumbnail(null);
  };

  const setDefaultValue = useCallback(() => {
    const tempProjectData = dispatch(selectTempProjectData());

    if (!tempProjectData) {
      // if 1st time visit Create Step, with empty project data, set default thumbnail
      if (!uploadedFiles || uploadedFiles.length === 0) return;

      if (uploadedFiles.length > 0) {
        setDefaultThumbnail(uploadedFiles[0].thumbnail);
      }
      return;
    }

    reset({
      projectName: tempProjectData.projectName,
      completedOn:
        tempProjectData.completedOn && new Date(tempProjectData.completedOn),
      projectLink: tempProjectData.projectLink,
      description: tempProjectData.description,
    });

    setTags(tempProjectData.tags || []);
    setThumbnail(tempProjectData.thumbnail);
    setDefaultThumbnail(tempProjectData.defaultThumbnail);
  }, [dispatch, reset, uploadedFiles]);

  useEffect(() => {
    setDefaultValue();
  }, [dispatch, setDefaultValue, reset, uploadedFiles]);

  useEffect(() => {
    if (isDirty) {
      // update tempData
      dispatch(changeTempProjectData(requestForm));
    }
  }, [requestForm, isDirty, reset, dispatch]);

  useEffect(() => {
    if (thumbnail) {
      dispatch(changeTempProjectData({ thumbnail }));
    }
  }, [dispatch, thumbnail]);

  useEffect(() => {
    if (tags.length > 0) {
      dispatch(changeTempProjectData({ tags }));
    }
  }, [dispatch, tags]);

  useEffect(() => {
    if (defaultThumbnail) {
      dispatch(changeTempProjectData({ defaultThumbnail }));
    }
  }, [defaultThumbnail, dispatch]);

  return (
    <>
      <ModalHeader
        boxShadow={'0px 1px 0px rgba(0, 0, 0, 0.25)'}
        fontSize={24}
        fontWeight={'bold'}
        h={'56px'}
        py={'12px'}
        onClose={onClose}
      >
        {t('CreateNewProject')}
      </ModalHeader>

      <ModalCloseButton top={'14px'} />

      <ModalBody p={'40px'}>
        <Flex sx={{ gap: '16px' }} direction={['column', 'row']}>
          <Box flexGrow={1} pos={'relative'}>
            <Box fontWeight={500}>{t('ProjectThumbnail')}</Box>

            <Center maxW={'100%'} pos={'relative'}>
              <Image
                src={thumbnail || defaultThumbnail}
                fallbackSrc={Placeholder}
                fit={'cover'}
                maxH={'229px'}
              />

              {isUploadingThumbnail && (
                <Spinner
                  pos={'absolute'}
                  top={'calc(50% - (1.5rem/2))'}
                  left={'calc(50% - (1.5rem/2))'}
                />
              )}
            </Center>

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
                top={'34px'}
                right={'8px'}
                rounded={'full'}
                onClick={deleteThumbnail}
              />
            )}

            <ThumbnailDropzone
              project={{ thumbnailDefault: thumbnail }}
              title={
                thumbnail || defaultThumbnail
                  ? t('EditThumbnail')
                  : t('UploadThumbnail')
              }
              currentThumbnail={thumbnail}
              onChangeThumbnail={onSetThumbnail}
            />
          </Box>

          <Grid templateColumns={'repeat(2, 1fr)'} gap={'16px'}>
            <GridItem colSpan={[2, 1]}>
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
            </GridItem>

            <GridItem colSpan={[2, 1]}>
              <FormControl>
                <FormLabel mb={'2px'}>{t('CompletedOn')}</FormLabel>
                <Controller
                  render={({ field: { value, onChange } }) => (
                    <InputGroup
                      sx={{
                        '.react-datepicker-wrapper': {
                          w: '100%',
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
                  name={`completedOn`}
                  control={control}
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel mb={'2px'}>{t('LinkToFullProject')}</FormLabel>
                <Input {...register('projectLink')} />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
              <FormControl>
                <FormLabel mb={'2px'}>{t('Description')}</FormLabel>
                <Textarea {...register('description')} resize={'none'} />
              </FormControl>
            </GridItem>

            <GridItem colSpan={2}>
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
            </GridItem>
          </Grid>
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Button variant={'secondary'} onClick={() => onChangeStep(false)}>
          {t('Back')}
        </Button>

        <Spacer />

        <Button variant={'primary'} onClick={handleSubmit(onSubmit)}>
          {t('Create')}
        </Button>
      </ModalFooter>
    </>
  );
}

export default CreateStep;

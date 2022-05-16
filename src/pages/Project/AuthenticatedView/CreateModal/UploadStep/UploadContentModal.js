import {
  Box,
  Center,
  Flex,
  HStack,
  Image,
  ListItem,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  Button,
  Spacer,
  UnorderedList,
  Spinner,
} from '@chakra-ui/react';
import ImageIcon from '../../../../../images/assets/image.png';
import { ReactComponent as UpArrow } from '../../../../../images/icons/u_arrow-up.svg';
import { bytesToSize } from '../../../../../utils/userUtils';
import { useDispatch, useSelector } from 'react-redux';
import { selectAvailableCapacity } from '../../../../../slices/user';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import { uploadFile } from '../../../../../slices/project';
import { checkExceedCapacity } from '../../../../../utils/projectUtils';

const UploadContentModal = ({
  children,
  uploadedFiles,
  onExceedCapacity,
  isOpen,
  onClose,
  onContinue,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const availableCapacity = useSelector(selectAvailableCapacity);
  const [loading, setLoading] = useState(false);
  const onDrop = useCallback(
    async (files) => {
      if (checkExceedCapacity(files, availableCapacity)) {
        onExceedCapacity();
      } else {
        setLoading(true);
        await Promise.all(
          files.map(async (file) => await dispatch(uploadFile(file)))
        );
        setLoading(false);
      }
    },
    [availableCapacity, dispatch, onExceedCapacity]
  );
  const { getRootProps, getInputProps } = useDropzone({
    accept:
      'image/*, audio/*, video/MPEG-4, video/mpeg-4, video/mp4, video/MP4, video/quicktime',
    onDrop,
  });

  return (
    <Modal
      isCentered
      closeOnEsc={false}
      closeOnOverlayClick={false}
      scrollBehavior={'inside'}
      isOpen={isOpen}
      onClose={onClose}
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
        <ModalHeader
          boxShadow={'0px 1px 0px rgba(0, 0, 0, 0.25)'}
          fontSize={24}
          fontWeight={'bold'}
          h={'56px'}
          py={'12px'}
        >
          {t('CreateNewProject')}
        </ModalHeader>

        <ModalCloseButton top={'14px'} />

        <ModalBody py={'40px'}>
          <Center
            border={uploadedFiles.length > 0 ? 'none' : '1px dashed #DBE1E6'}
            minH={uploadedFiles.length > 0 ? '106px' : '620px'}
          >
            <input {...getInputProps()} />

            <Flex direction={'column'} alignItems={'center'} w={'100%'}>
              <Image src={ImageIcon} boxSize={'48px'} mb={'6px'} />

              <HStack
                {...getRootProps()}
                color={'primary'}
                cursor={'pointer'}
                spacing={'4px'}
              >
                <Box>{t('Browse')}</Box>
                <Box as={UpArrow} fill={'primary'} />
              </HStack>

              {loading && <Spinner mt={'24px'} />}

              {uploadedFiles.length === 0 && (
                <UnorderedList mt={'40px'} spacing={'6px'}>
                  <ListItem>
                    {t('AvailableCapacity')}:&nbsp;
                    <Box as={'span'} color={'primary'}>
                      {bytesToSize(availableCapacity)}
                    </Box>
                  </ListItem>

                  <ListItem>{t('HQImages')}</ListItem>

                  <ListItem>{t('Video')}</ListItem>
                </UnorderedList>
              )}

              {children}
            </Flex>
          </Center>
        </ModalBody>

        <ModalFooter pt={0}>
          <Button variant={'secondary'} onClick={onClose}>
            {t('Cancel')}
          </Button>

          <Spacer />

          <Button
            variant={uploadedFiles.length ? 'primary' : 'secondary'}
            onClick={onContinue}
            disabled={uploadedFiles.length === 0}
          >
            {t('Continue')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadContentModal;

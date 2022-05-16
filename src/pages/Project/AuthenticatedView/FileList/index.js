import {
  Box,
  Button,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import { ReactComponent as EditIcon } from '../../../../images/icons/u_edit-alt.svg';
import { useTranslation } from 'react-i18next';

const DisplayFile = loadable(() => import('./DisplayFile'));

const UploadFile = ({ file, idx, onDelete }) => {
  const { t } = useTranslation();
  const { onOpen, onClose, isOpen } = useDisclosure();

  const handleDeleteFile = () => {
    onDelete(file, idx);
    onClose();
  };

  return (
    <Box mt={'24px'} maxH={'600px'} pos={'relative'}>
      <DisplayFile file={file} />

      <Popover
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        placement={'bottom-end'}
      >
        <PopoverTrigger>
          <IconButton
            aria-label={'Edit'}
            icon={<Box as={EditIcon} boxSize={'18px'} fill={'black'} />}
            boxSize={'30px'}
            bg={'primary'}
            pos={'absolute'}
            top={'10px'}
            right={'10px'}
            minW={'auto'}
            rounded={'full'}
          />
        </PopoverTrigger>
        <PopoverContent maxW={'110px'} rounded={2} _focus={{}}>
          <PopoverBody>
            <Button
              variant={'ghost'}
              cursor={'pointer'}
              fontSize={14}
              fontWeight={'normal'}
              p={0}
              h={'auto'}
              textTransform={'none'}
              _hover={{}}
              onClick={handleDeleteFile}
            >
              {t('Delete file')}
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default UploadFile;

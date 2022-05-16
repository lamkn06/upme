import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ScrollIcon } from '../../../../images/icons/u_angle-double-down.svg';
import { ReactComponent as AngleLeft } from '../../../../images/icons/u_angle-left.svg';


const Thumbnail = loadable(() => import('./Thumbnail'));

const ViewProjectModal = ({
  isOpen,
  onClose,
  project,
  onOpenEditModal,
  readOnly = false,
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState();
  const [isScrollDownIconDisplayed, toggleScrollDownIcon] = useState(true);

  useEffect(() => {
    setSelectedFile(project.files[0]);
  }, [project]);

  
  const onPageScroll = (e) => {
    if (!isScrollDownIconDisplayed && e.currentTarget.scrollTop < 5) {
      toggleScrollDownIcon(true);
    }

    if (isScrollDownIconDisplayed && e.currentTarget.scrollTop > 5) {
      toggleScrollDownIcon(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onPageScroll);
    return () => {
      window.removeEventListener('scroll', onPageScroll);
    };
  }, []);

  const getClickableLink = (link) => {
    return link.startsWith("http://") || link.startsWith("https://") ?
      link
      : `http://${link}`;
  };

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
        minH={['100vh', '96vh']} //full height for mobile view
        rounded={['none', 2]}
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
          {t('ViewProject')}
        </ModalHeader>

        <ModalCloseButton top={'14px'} />

        <ModalBody p={'40px'} onScroll={onPageScroll}>
          <Box border={'1px solid'}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            borderColor={'mono3'}
            mb={'16px'}
            h={['50vh', '56vh']}>
            <Thumbnail thumbnail={selectedFile} />
          </Box>

          <Flex align={'center'} mx={'-40px'}>
            <IconButton
              aria-label={'Show Previous'}
              icon={<Box as={AngleLeft} boxSize={'32px'} fill={'#06DCFF'} />}
              bg={'none'}
              _hover={{}}
            />
            <Flex
              flex={'1 0 1px'}
              overflowX={'auto'}
              sx={{
                gap: '16px',
              }}
            >
              {project.files.map((i) => (
                <Image
                  key={i.thumbnail}
                  src={i.thumbnail}
                  h={'114px'}
                  w={'196px'}
                  fit={'cover'}
                  onClick={() => setSelectedFile(i)}
                  border={selectedFile?.thumbnail === i?.thumbnail ? '2px solid' : 'none'}
                  borderColor={'primary'}
                />
              ))}
            </Flex>
            <IconButton
              aria-label={'Show Next'}
              icon={
                <Box
                  as={AngleLeft}
                  boxSize={'32px'}
                  fill={'#06DCFF'}
                  transform={'rotate(180deg)'}
                />
              }
              bg={'none'}
              _hover={{}}
            />
          </Flex>

          <Box fontSize={24} fontWeight={'bold'} lineHeight={1.32} mt={'40px'}>
            {project.name}
          </Box>
          {project.dateCompleted && (
            <Box fontSize={20} lineHeight={'30px'} mt={'8px'}>
              {format(new Date(project.dateCompleted), 'dd/MM/yyyy')}
            </Box>
          )}
          {project.description && (
            <Box whiteSpace={'pre-wrap'} fontSize={16} lineHeight={'24px'} mt={'8px'}>
              {project.description}
            </Box>
          )}
          {project.link && (
            <Flex fontSize={16} lineHeight={'24px'} mt={'8px'}>
              <Box>
                {t('LinkToFullProject')}:{' '}
                <Box as={'a'} color={'#06DCFF'}  href={getClickableLink(project.link)} target={'_blank'}>
                  {project.link}
                </Box>
              </Box>
            </Flex>
          )}
        </ModalBody>

        <ModalFooter
          p={'20px 40px'}
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          pos={'relative'}>
          {isScrollDownIconDisplayed &&
            <Box
              pos={['fixed', 'absolute']}
              top={['unset','50%']}
              background={['white', 'unset']}
              width={['100vw', 'fit-content']}
              height={['60px', 'fit-content']}
              bottom={['30px', 'unset']}
              left={'50%'}
              transform={'translate(-50%, -50%);'}
            >
              <Box fontSize={16} textAlign={'center'}>{t('Scroll down to view project details')}</Box>
              <Box as={ScrollIcon} w={'40px'} fill={'primary'} mx={'auto'} />
            </Box>}
          <Button variant={'secondary'} minW={'120px'} onClick={onClose}>
            {t('Close')}
          </Button>
          {!readOnly && (
            <Button
              variant={'primary'}
              minW={'132px'}
              onClick={() => {
                onOpenEditModal();
              }}
            >
              {t('Edit')}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewProjectModal;

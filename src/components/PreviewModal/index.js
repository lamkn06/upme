import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spinner,
  useBoolean,
  useToast,
} from '@chakra-ui/react';
import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as AngleDownIcon } from '../../images/icons/u_angle-down.svg';
import { ReactComponent as LinkIcon } from '../../images/icons/u_link.svg';
import { ReactComponent as PDFIcon } from '../../images/icons/u_pdf.svg';
import { fetchPDFLink, selectProfile } from '../../slices/profile';
import FirstTemplate from '../PDFTemplate/FirstTemplate';
import SecondTemplate from '../PDFTemplate/SecondTemplate';
import ThirdTemplate from '../PDFTemplate/ThirdTemplate';
import TagManager from 'react-gtm-module';
import { selectAuthenticationStatus, selectUserId } from '../../slices/user';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PreviewModal({ isOpen, onClose }) {
  const [loading, setLoading] = useBoolean();
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const userId = useSelector(selectUserId);
  const isLoggedIn = useSelector(selectAuthenticationStatus);
  const [selected, setSelected] = useState(3);
  const [totalPages, setTotalPages] = useState(null);
  const { t } = useTranslation();
  const toast = useToast();
  const selectedFile = useMemo(() => {
    switch (selected) {
      case 1:
        return <FirstTemplate profile={profile} />;
      case 2:
        return <SecondTemplate profile={profile} />;
      case 3:
        return <ThirdTemplate profile={profile} />;
      default:
        return null;
    }
  }, [profile, selected]);
  const handleCopyShareLink = useCallback(
    (file) => {
      setLoading.on();
      dispatch(fetchPDFLink(file))
        .unwrap()
        .then((link) => {
          navigator.clipboard.writeText(link).then(
            () => {
              toast({
                title: t('Congratulation'),
                description: t('Share link has been copied to your clipboard!'),
                status: 'success',
                duration: 10000,
                position: 'bottom-right',
                isClosable: true,
              });
              TagManager.dataLayer({
                dataLayer: {
                  event: 'share_link_PDF',
                  user_id: userId,
                  user_type: isLoggedIn ? 'Free' : 'Guest',
                }
              });
            },
            () => {
              toast({
                title: t('Something went wrong'),
                description: t(
                  'Share link cannot be copied, please try again.'
                ),
                status: 'error',
                duration: 10000,
                position: 'bottom-right',
                isClosable: true,
              });
            }
          );
          setLoading.off();
        });
    },
    [dispatch, setLoading, t, toast]
  );

  //Leo work around hot fix
  const [firstLoad, setFirstLoad] = useState(true);
  const [blobLoaded, setBlobLoaded] = useState(false);
  useEffect(() => {
    if (firstLoad && blobLoaded) {
      setSelected(1);
      setFirstLoad(false);
    }
  }, [blobLoaded, firstLoad]);

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior={'inside'}
    >
      <ModalOverlay />

      <ModalContent
        maxH={'100vh'}
        maxW={['343px', '784px']}
        rounded={0}
        sx={{
          '*::-webkit-scrollbar': {
            w: 0,
          },
        }}
      >
        <ModalBody p={0}>
          <Grid
            templateColumns={['1fr', '600px 184px']}
            templateRows={['407px 140px 74px', '849px 78px']}
            sx={{
              '*::-webkit-scrollbar': {
                bg: 'none',
              },
            }}
          >
            <Flex
              basis={'600px'}
              direction={'column'}
              flexGrow={0}
              h={['407px', 'auto']}
            >
              <Flex
                flex={'1 0 1px'}
                overflow={'auto'}
                sx={{
                  '.react-pdf__Document': {
                    d: 'flex',
                    flexDir: 'column',
                    flexGrow: 1,
                  },
                  '.react-pdf__Page': {
                    d: 'flex',
                    flexGrow: 1,
                  },
                  '.react-pdf__Page__canvas': {
                    border: '1px solid #F8F8F9',
                    objectFit: 'contain',
                    objectPosition: 'top',
                    flexGrow: 1,
                    height: 'fit-content !important',
                    maxH: '100%',
                    maxW: '100%',
                    mx: 'auto',
                  },
                }}
              >
                <BlobProvider document={selectedFile}>
                  {({ url }) => {
                    if (url) {
                      //Leo Work around for first load
                      if (firstLoad) {
                        return (
                          <>
                            <Document
                              file={url}
                              loading={null}
                              onLoadSuccess={() => {
                                setBlobLoaded(true);
                              }}
                            />
                            <Center flexGrow={1}>
                              <Spinner />
                            </Center>
                          </>
                        );
                      } else {
                        return (
                          <Document
                            file={url}
                            loading={null}
                            onLoadSuccess={({ numPages }) => {
                              setTotalPages(numPages);
                            }}
                          >
                            {Array.from(new Array(totalPages), (el, index) => (
                              <Page
                                key={`page_${index + 1}`}
                                loading={null}
                                pageNumber={index + 1}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                              />
                            ))}
                          </Document>
                        );
                      }
                    }

                    return (
                      <Center flexGrow={1}>
                        <Spinner />
                      </Center>
                    );
                  }}
                </BlobProvider>
              </Flex>
            </Flex>

            <Flex
              ml={['16px', '24px']}
              mr={['16px', 0]}
              my={'15px'}
              order={[3, 2]}
            >
              <Button
                bg={'white'}
                border={'1px solid #C8CFD3'}
                borderRadius={0}
                d={['none', 'inline-flex']}
                h={'48px'}
                minW={'130px'}
                onClick={onClose}
              >
                {t('Cancel')}
              </Button>

              <Menu placement={'bottom-end'}>
                <MenuButton
                  as={Button}
                  isLoading={loading}
                  bg={'primary'}
                  borderRadius={0}
                  h={'48px'}
                  ml={'auto'}
                  minW={['full', '178px']}
                  pr={'10px'}
                  _active={{}}
                  _focus={{}}
                  _hover={{}}
                >
                  {t('Export to')}
                  <Icon as={AngleDownIcon} boxSize={'20px'} fill={'black'} />
                </MenuButton>

                <MenuList rounded={'none'}>
                  <PDFDownloadLink
                    document={selectedFile}
                    fileName={profile.displayName || 'unnamed'}
                  >
                    <MenuItem
                      key={'pdf'}
                      icon={
                        <Icon as={PDFIcon} boxSize={'24px'} fill={'inherit'} />
                      }
                      sx={{
                        '.chakra-menu__icon-wrapper': {
                          me: '8px',
                        },
                      }}
                      _focus={{}}
                      _hover={{
                        bg: 'none',
                        color: 'primary',
                        fill: 'primary',
                      }}
                      onClick={() => {
                        TagManager.dataLayer({
                          dataLayer: {
                            event: 'download_PDF',
                            user_id: userId,
                            user_type: isLoggedIn ? 'Free' : 'Guest',
                          }
                        });
                      }}
                    >
                      {t('Export resume to PDF')}
                    </MenuItem>
                  </PDFDownloadLink>

                  <BlobProvider document={selectedFile}>
                    {({ blob }) => {
                      if (blob) {
                        return (
                          <MenuItem
                            key={'link'}
                            icon={
                              <Icon
                                as={LinkIcon}
                                boxSize={'24px'}
                                fill={'inherit'}
                              />
                            }
                            sx={{
                              '.chakra-menu__icon-wrapper': {
                                me: '8px',
                              },
                            }}
                            _focus={{}}
                            _hover={{
                              bg: 'none',
                              color: 'primary',
                              fill: 'primary',
                            }}
                            onClick={() => handleCopyShareLink(blob)}
                          >
                            {t('Get a shareable link')}
                          </MenuItem>
                        );
                      }

                      return (
                        <MenuItem
                          key={'link'}
                          isDisabled
                          icon={
                            <Icon
                              as={LinkIcon}
                              boxSize={'24px'}
                              fill={'inherit'}
                            />
                          }
                          sx={{
                            '.chakra-menu__icon-wrapper': {
                              me: '8px',
                            },
                          }}
                        >
                          {t('Get a shareable link')}
                        </MenuItem>
                      );
                    }}
                  </BlobProvider>
                </MenuList>
              </Menu>
            </Flex>

            <Flex
              basis={['auto', '184px']}
              direction={'column'}
              grow={[1, 0]}
              mt={'4px'}
              px={'16px'}
              w={'full'}
              sx={{
                '*::-webkit-scrollbar': {
                  h: 0,
                },
              }}
            >
              <Box
                d={['block', 'none']}
                fontSize={12}
                fontWeight={500}
                mb={'4px'}
              >
                {t('Template')}
              </Box>

              <Flex
                align={'center'}
                direction={['row', 'column']}
                flex={'1 0 1px'}
                h={['110px', 'auto']}
                minH={'110px'}
                my={[0, '60px']}
                overflowX={['auto', null]}
                overflowY={[null, 'auto']}
                sx={{
                  gap: ['4px', '24px'],
                }}
              >
                <Center
                  border={selected === 1 ? '1px solid #06DCFF' : 'none'}
                  boxShadow={'0px 4px 16px rgba(0, 0, 0, 0.1)'}
                  h={['110px', '171px']}
                  w={['80px', '120px']}
                  sx={{
                    '.react-pdf__Document': {
                      d: 'flex',
                      flexGrow: 1,
                      maxH: '100%',
                      maxW: '100%',
                    },
                    '.react-pdf__Page': {
                      d: 'flex',
                      flexGrow: 1,
                    },
                    '.react-pdf__Page__canvas': {
                      objectFit: 'cover',
                      objectPosition: 'top',
                      flexGrow: 1,
                      maxH: '100%',
                      maxW: '100%',
                      mx: 'auto',
                    },
                  }}
                  onClick={() => {
                    setSelected(1);
                  }}
                >
                  <BlobProvider document={<FirstTemplate profile={profile} />}>
                    {({ url }) => {
                      if (url) {
                        return (
                          <Document file={url} loading={null}>
                            <Page
                              loading={null}
                              pageNumber={1}
                              width={120}
                              renderAnnotationLayer={false}
                              renderTextLayer={false}
                            />
                          </Document>
                        );
                      }

                      return <Spinner />;
                    }}
                  </BlobProvider>
                </Center>

                <Center
                  border={selected === 2 ? '1px solid #06DCFF' : 'none'}
                  boxShadow={'0px 4px 16px rgba(0, 0, 0, 0.1)'}
                  h={['110px', '171px']}
                  w={['80px', '120px']}
                  sx={{
                    '.react-pdf__Document': {
                      d: 'flex',
                      flexGrow: 1,
                      maxH: '100%',
                      maxW: '100%',
                    },
                    '.react-pdf__Page': {
                      d: 'flex',
                      flexGrow: 1,
                    },
                    '.react-pdf__Page__canvas': {
                      objectFit: 'cover',
                      objectPosition: 'top',
                      flexGrow: 1,
                      maxH: '100%',
                      maxW: '100%',
                      mx: 'auto',
                    },
                  }}
                  onClick={() => {
                    setSelected(2);
                  }}
                >
                  <BlobProvider document={<SecondTemplate profile={profile} />}>
                    {({ url }) => {
                      if (url) {
                        return (
                          <Document file={url} loading={null}>
                            <Page
                              loading={null}
                              pageNumber={1}
                              width={120}
                              renderAnnotationLayer={false}
                              renderTextLayer={false}
                            />
                          </Document>
                        );
                      }

                      return <Spinner />;
                    }}
                  </BlobProvider>
                </Center>

                <Center
                  boxShadow={'0px 4px 16px rgba(0, 0, 0, 0.1)'}
                  h={['110px', '171px']}
                  w={['80px', '120px']}
                  sx={{
                    '.react-pdf__Document': {
                      d: 'flex',
                      flexGrow: 1,
                      maxH: '100%',
                      maxW: '100%',
                    },
                    '.react-pdf__Page': {
                      d: 'flex',
                      flexGrow: 1,
                    },
                    '.react-pdf__Page__canvas': {
                      objectFit: 'cover',
                      objectPosition: 'top',
                      flexGrow: 1,
                      maxH: '100%',
                      maxW: '100%',
                      mx: 'auto',
                    },
                  }}
                  onClick={() => {
                    setSelected(3);
                  }}
                >
                  <BlobProvider document={<ThirdTemplate profile={profile} />}>
                    {({ url }) => {
                      if (url) {
                        return (
                          <Document file={url} loading={null}>
                            <Page
                              loading={null}
                              pageNumber={1}
                              width={120}
                              renderAnnotationLayer={false}
                              renderTextLayer={false}
                            />
                          </Document>
                        );
                      }

                      return <Spinner />;
                    }}
                  </BlobProvider>
                </Center>
              </Flex>
            </Flex>
          </Grid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default PreviewModal;

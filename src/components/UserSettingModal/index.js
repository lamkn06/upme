import {
  Box,
  chakra,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Progress,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import GoogleIcon from '../../images/google.svg';
import { selectProfile } from '../../slices/profile';
import {
  selectCurrentCapacity,
  selectTotalCapacity,
  selectUserPage,
} from '../../slices/user';

export const UserSettingModal = (props) => {
  const { t } = useTranslation();

  const { isOpen, onClose } = props;
  const profile = useSelector(selectProfile);
  const userPage = useSelector(selectUserPage);

  const currentCapacity = useSelector(selectCurrentCapacity);
  const totalCapacity = useSelector(selectTotalCapacity);

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent rounded={'2px'} minW={'730px'} minH={'703px'}>
        <ModalHeader p={'16px 24px'} borderBottom={'1px solid  #DBE1E6'}>
          <Heading variant={'h5'}>{t('Setting')}</Heading>

          <ModalCloseButton
            boxSize={'22px'}
            top={'16px'}
            right={'24px'}
            _focus={{}}
            _hover={{}}
            onClick={onClose}
          />
        </ModalHeader>
        <ModalBody p={'24px 24px 0'} mb={'40px'}>
          <Tabs>
            <TabList border="none">
              <Tab
                _selected={{
                  outline: 'none',
                  fontWeight: 'bold',
                  borderBottom: '2px solid #06DCFF',
                }}
                _focus={{
                  outline: 'none',
                }}
                fontSize={16}
                style={{
                  padding: '10px 0',
                }}
                marginRight={10}
              >
                {t('General Information')}
              </Tab>
              <Tab
                _selected={{
                  fontWeight: 'bold',
                  borderBottom: '2px solid #06DCFF',
                }}
                _focus={{
                  outline: 'none',
                }}
                fontSize={16}
                style={{
                  padding: '10px 0',
                }}
              >
                {t('Security and Private')}
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <FormControl>
                  <Box
                    style={{
                      padding: '10px 0',
                    }}
                  >
                    <Grid
                      templateColumns="repeat(4, 1fr)"
                      gap={5}
                      paddingTop={3}
                      paddingBottom={3}
                    >
                      <GridItem colSpan={1}>
                        <FormLabel
                          fontWeight={'bold'}
                          minWidth={120}
                          margin={0}
                        >
                          {t('Email')}
                        </FormLabel>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <FormLabel margin={0}>{profile.email}</FormLabel>
                      </GridItem>
                      <GridItem colSpan={1}>
                        <Flex>
                          <Image
                            src={GoogleIcon}
                            boxSize={'24px'}
                            mr={'12px'}
                          />
                          Google
                        </Flex>
                      </GridItem>
                    </Grid>
                    <Grid
                      templateColumns="repeat(4, 1fr)"
                      gap={5}
                      paddingTop={3}
                      paddingBottom={3}
                    >
                      <GridItem colSpan={1}>
                        <FormLabel
                          fontWeight={'bold'}
                          minWidth={120}
                          margin={0}
                        >
                          {t('Profile URL')}
                        </FormLabel>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <FormLabel
                          margin={0}
                        >{`${window.location.origin}/${userPage}`}</FormLabel>
                      </GridItem>
                      <GridItem colSpan={1} cursor={'pointer'}>
                        <chakra.span
                          color={'#06DCFF'}
                          fontSize={16}
                          fontWeight={'bold'}
                        >
                          {t('Edit URL')}
                        </chakra.span>
                      </GridItem>
                    </Grid>
                  </Box>
                  <Divider borderStyle={'dashed'} />
                  <Box
                    style={{
                      padding: '20px 0',
                    }}
                  >
                    <Grid
                      templateColumns="repeat(4, 1fr)"
                      gap={5}
                      paddingTop={3}
                      paddingBottom={3}
                    >
                      <GridItem colSpan={1}>
                        <FormLabel
                          fontWeight={'bold'}
                          minWidth={120}
                          margin={0}
                        >
                          {t('Subscription')}
                        </FormLabel>
                      </GridItem>
                      <GridItem colSpan={2}>
                        <FormLabel margin={0}>Free</FormLabel>
                      </GridItem>
                      <GridItem colSpan={1} cursor={'pointer'}>
                        <chakra.span
                          color={'#06DCFF'}
                          fontSize={16}
                          fontWeight={'bold'}
                        >
                          {t('See All Plans')}
                        </chakra.span>
                      </GridItem>
                    </Grid>
                    <Grid
                      templateColumns="repeat(4, 1fr)"
                      gap={5}
                      paddingTop={3}
                      paddingBottom={3}
                    >
                      <GridItem colSpan={1}>
                        <FormLabel
                          fontWeight={'bold'}
                          minWidth={120}
                          margin={0}
                        >
                          {t('Data Storage')}
                        </FormLabel>
                      </GridItem>
                      <GridItem colSpan={2} alignSelf="center">
                        <Progress
                          value={(currentCapacity / totalCapacity) * 100}
                          borderRadius={16}
                          sx={{
                            div: {
                              backgroundColor: '#06dcff',
                            },
                          }}
                        />
                      </GridItem>
                      <GridItem colSpan={1} cursor={'pointer'}>
                        <chakra.span
                          color={'#06DCFF'}
                          fontSize={16}
                          fontWeight={'bold'}
                        >
                          {t('Get More Storage')}
                        </chakra.span>
                      </GridItem>
                    </Grid>
                  </Box>
                </FormControl>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

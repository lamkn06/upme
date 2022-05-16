import {
  ModalBody,
  Heading,
  Text,
  CircularProgress,
  Flex,
  Box,
  chakra,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import React from 'react';
import { ReactComponent as CreditCardIcon } from '../../images/icons/u_credit-card.svg';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { bytesToSize } from '../../utils/userUtils';
import {
  selectCurrentCapacity,
  selectTotalCapacity,
  selectAvailableCapacity,
} from '../../slices/user';

function GetMoreStorageModalBody({ openRequestForm }) {
  const { t } = useTranslation();
  const currentCapacity = useSelector(selectCurrentCapacity);
  const totalCapacity = useSelector(selectTotalCapacity);
  const availableCapacity = useSelector(selectAvailableCapacity);
  const price = '10,800';

  return (
    <>
      <ModalBody p={'0 32px'} mb={['auto', '158px']}>
        <Heading size="lg" fontSize="24px" mb={'16px'}>
          {t('Your current data Storage')}
        </Heading>
        <Text>{t('Storage is used for images and video upload')}</Text>
        <Flex alignItems={'center'} direction={['column', 'row']}>
          <Box position={'relative'} flexGrow={1}>
            <CircularProgress
              style={{ transform: 'rotateY(180deg)' }}
              capIsRound
              color="primary"
              trackColor="#F8F8F9"
              value={(currentCapacity / totalCapacity) * 100}
              size="240px"
              thickness="8px"
            />
            <Box
              position={'absolute'}
              top={'60px'}
              left={'60px'}
              w={'120px'}
              h={'120px'}
              textAlign={'center'}
              py={'25px'}
              boxShadow={'0px 2px 16px rgba(0, 0, 0, 0.1);'}
              borderRadius={'50%'}
            >
              <Heading size="lg" fontSize="34px" mb={'8px'}>
                {((currentCapacity / totalCapacity) * 100).toFixed(0)}%
              </Heading>
              <Text color={'mono2'}>
                {t('Total {{total}}', { total: bytesToSize(totalCapacity) })}
              </Text>
            </Box>
          </Box>
          <Box flexGrow={1}>
            <Flex>
              <Box
                w={'24px'}
                h={'24px'}
                borderRadius={'50%'}
                background={'primary'}
              />
              <Box ml={'16px'}>
                {t('Used {{current}}', {
                  current: bytesToSize(currentCapacity),
                })}
              </Box>
            </Flex>
            <Flex mt={'40px'}>
              <Box
                w={'24px'}
                h={'24px'}
                borderRadius={'50%'}
                background={'primaryBG'}
              />
              <Box ml={'16px'}>
                {t('Left {{available}}', {
                  available: bytesToSize(availableCapacity),
                })}
              </Box>
            </Flex>
          </Box>
        </Flex>
        <Box
          p={'17px 27px'}
          mt={'36px'}
          h={'64px'}
          w={'100%'}
          border={'1px solid #DBE1E6'}
          display={'flex'}
          justifyContent={'flex-start'}
        >
          <Box as={CreditCardIcon} fill={'primary'} display={'inline-block'} />
          <Box display={'inline-block'} ml={'27px'}>
            {t(`Additional Storage pricing`)}{' '}
            <chakra.span color={'primary'}>{price} VND/GB</chakra.span>
          </Box>
        </Box>
      </ModalBody>
      <ModalFooter pt={['40px', 0]} pb={'40px'} justifyContent={'center'}>
        <Button variant={'primary'} onClick={openRequestForm}>
          {t('Contact us to get more storage')}
        </Button>
      </ModalFooter>
    </>
  );
}

export default GetMoreStorageModalBody;

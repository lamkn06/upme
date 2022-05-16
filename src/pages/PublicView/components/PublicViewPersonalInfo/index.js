import { Flex, Box, Image, Heading, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import emptyPicture from '../../../../images/avatar-placeholder.svg';
import avatarBorder from '../../../../images/AvatarBorder.png';
import avatarBG from '../../../../images/AvatarBG.png';
import mainBG from '../../../../images/pvPersonalInfoBG1.png';
import mainBGMobile from '../../../../images/pvPersonalInfoBG2.png';
import { ReactComponent as MailIcon } from '../../../../images/icons/u_fast-mail.svg';
import { ReactComponent as PhoneIcon } from '../../../../images/icons/u_phone-alt.svg';
import { ReactComponent as HomeIcon } from '../../../../images/icons/u_home-alt.svg';
import { transformBG, removeListenerTransformBG } from './backgroundEff';
import './backgroundEff.css';

function PublicViewPersonalInfo({ data }) {
  const {
    personalStatement,
    fullName,
    displayName,
    position,
    email,
    phoneNumber,
    location,
    profilePicture,
  } = data;

  useEffect(function initialTransformBG() {
    transformBG();
    return () => {
      removeListenerTransformBG();
    };
  }, []);

  return (
    <Flex
      alignItems={'center'}
      flexGrow={1}
      pos={'relative'}
      className={'container'}
      w={'100%'}
      overflowX={'hidden'}
      mt={'-24px'}
      minH={'calc(100vh - 64px)'}
    >
      <Box id={'mainContent'} className={'mainContent'}>
        <Flex
          mt={'40px'}
          align={['flex-start', 'center']}
          justify={['flex-start', 'center']}
          direction={'column'}
        >
          <Flex direction={['row', 'column']} alignItems={'center'} w={'100%'}>
            <Box pos={'relative'} mr={['16px', 'unset']} minWidth={['96px']}>
              <Image
                borderRadius={'full'}
                boxSize={['96px', '130px']}
                mb={'16px'}
                p={'5px'}
                src={profilePicture || emptyPicture}
              />
              <Image
                pos={'absolute'}
                boxSize={['96px', '130px']}
                top={0}
                src={avatarBorder}
              />
              <Image
                pos={'absolute'}
                boxSize={['96px', '130px']}
                top={0}
                src={avatarBG}
              />
            </Box>
            <Flex direction={'column'} alignItems={['flex-start', 'center']}>
              <Heading variant={'h5'} mb={'4px'} fontWeight={'700'}>
                {displayName || '?'}
              </Heading>
              {fullName && (
                <Text variant={'subtitle2'} mb={'24px'}>
                  {fullName}
                </Text>
              )}
            </Flex>
          </Flex>
          <Flex
            mb={'40px'}
            width={'100%'}
            align={['flex-start', 'center']}
            justify={['flex-start', 'center']}
            direction={['column', 'row']}
            wrap={'wrap'}
            fontSize={'md'}
          >
            {email && (
              <Box>
                <Box
                  as={MailIcon}
                  display={'inline'}
                  mr={'10px'}
                  boxSize={'20px'}
                  fill={'primary'}
                />
                {email}
              </Box>
            )}
            {phoneNumber && (
              <Box ml={[0, '24px']}>
                <Box
                  as={PhoneIcon}
                  display={'inline'}
                  mr={'10px'}
                  mb={'5px'}
                  boxSize={'20px'}
                  fill={'primary'}
                />
                {phoneNumber}
              </Box>
            )}
            {location && (
              <Box ml={[0, '24px']}>
                <Box
                  as={HomeIcon}
                  display={'inline'}
                  mr={'10px'}
                  mb={'5px'}
                  boxSize={'20px'}
                  fill={'primary'}
                />
                {location}
              </Box>
            )}
          </Flex>
          {position && (
            <Text variant={'subtitle1'} mb={'8px'} fontWeight={'700'}>
              {position}
            </Text>
          )}
          {personalStatement && (
            <Text
              variant={'subtitle2'}
              textAlign={['left', 'center']}
              w={['80vw', '60vw']}
              maxH={'192px'}
              mb={'4px'}
              lineHeight={'38px'}
            >
              {personalStatement}
            </Text>
          )}
        </Flex>
      </Box>
      <Box display={'flex'} alignItems={'center'}>
        <Image
          className={'movingObject'}
          src={mainBG}
          d={['none', 'block']}
        ></Image>
        <Image
          className={'movingObject'}
          src={mainBGMobile}
          d={['block', 'none']}
        ></Image>
      </Box>
    </Flex>
  );
}

export default PublicViewPersonalInfo;

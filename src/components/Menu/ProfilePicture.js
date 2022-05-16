import { Box, Flex, Image, useBoolean, Text } from '@chakra-ui/react';
import loadable from '@loadable/component';
import AvatarPlaceholder from '../../images/avatar-placeholder.svg';
import { ReactComponent as EditIcon } from '../../images/icons/u_edit-alt.svg';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectDisplayName, selectProfile } from '../../slices/profile';
import { AnimatePresence, motion } from 'framer-motion';

const ProfileModal = loadable(() => import('../ProfileModal'));

const MotionFlex = motion(Flex);

const ProfilePicture = ({ isOpen }) => {
  const [isProfileModalOpen, setProfileModalOpen] = useBoolean();
  const profile = useSelector(selectProfile);
  const { profilePicture } = profile;
  const displayName = useSelector(selectDisplayName);

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionFlex
          direction={'column'}
          align={'center'}
          mt={['28px', '44px']}
          animate={'visible'}
          exit={'hidden'}
          variants={{
            hidden: {
              opacity: 0,
            },
            visible: {
              opacity: 1,
            },
          }}
        >
          <Box position={'relative'}>
            {profilePicture ? (
              <Image
                src={profilePicture}
                boxSize={112}
                border={'2px solid white'}
                borderRadius={24}
                mx={'auto'}
              />
            ) : (
              <Image
                src={AvatarPlaceholder}
                bg={'#F8F8F9'}
                boxSize={112}
                border={'2px solid white'}
                borderRadius={24}
                mx={'auto'}
                pt={'12px'}
                px={'12px'}
              />
            )}

            <Box
              as={EditIcon}
              fill={'black'}
              boxSize={'32px'}
              borderRadius={'full'}
              bg={'primary'}
              cursor={'pointer'}
              p={'6px'}
              position={'absolute'}
              right={'-3px'}
              bottom={'-3px'}
              onClick={setProfileModalOpen.on}
            />

            <ProfileModal
              isOpen={isProfileModalOpen}
              onClose={setProfileModalOpen.off}
            />
          </Box>

          <Text
            isTruncated
            variant={'displayName'}
            color={'white'}
            mt={'12px'}
            textAlign={'center'}
          >
            {displayName || '?'}
          </Text>
        </MotionFlex>
      )}
    </AnimatePresence>
  );
};

export default ProfilePicture;

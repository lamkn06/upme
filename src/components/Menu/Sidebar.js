import { Box, Flex, Image } from '@chakra-ui/react';
import loadable from '@loadable/component';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useSelector } from 'react-redux';
import Logo from '../../images/logo.svg';
import { selectSidebarStatus } from '../../slices/user';

const ProfilePicture = loadable(() => import('../Menu/ProfilePicture'));
const MenuItem = loadable(() => import('./MenuItems'));
const StorageBar = loadable(() => import('./StorageBar'));
const LogoutButton = loadable(() => import('./LogoutButton'));

const MotionFlex = motion(Flex);

const Sidebar = () => {
  const isOpen = useSelector(selectSidebarStatus);

  return (
    <MotionFlex
      direction={'column'}
      d={['none', 'flex']}
      bg={'black'}
      position={'fixed'}
      top={0}
      bottom={0}
      left={0}
      overflowY={'auto'}
      zIndex={1}
      initial={{
        opacity: 0,
        width: 0,
      }}
      animate={{
        opacity: 1,
        width: isOpen ? 260 : 72,
      }}
      sx={{
        scrollbarWidth: 'none'
      }}
    >
      <Flex align={'center'} h={'64px'} px={isOpen ? '32px' : '24px'}>
        <Image src={Logo} boxSize={'24px'} mx={isOpen ? 0 : 'auto'} />

        <AnimatePresence>
          {isOpen && (
            <Box
              color={'primary'}
              fontSize={18}
              fontWeight={700}
              ml={'8px'}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Upme
            </Box>
          )}
        </AnimatePresence>
      </Flex>

      <Box px={isOpen ? '32px' : '24px'}>
        <ProfilePicture isOpen={isOpen} />
      </Box>

      <Box mt={'68px'} px={isOpen ? '32px' : '24px'}> 
        <MenuItem />
      </Box>

      {isOpen &&
      (<Box px={isOpen ? '32px' : '24px'}>
        <StorageBar />
      </Box>)}

      <Box borderTop={'1px solid white'} mt={'auto'}>
        <LogoutButton />
      </Box>
    </MotionFlex>
  );
};

export default Sidebar;

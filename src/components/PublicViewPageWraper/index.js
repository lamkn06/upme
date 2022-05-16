import {
  Box,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  selectSidebarStatus,
  selectAuthenticationStatus,
} from '../../slices/user';

const Footer = loadable(() => import('./Footer'));
const Navbar = loadable(() => import('../Menu/PublicViewNavbar'));
const SideBar = loadable(() => import('../Menu/PublicViewSidebar'));
const TopBar = loadable(() => import('../Menu/TopBar'));

const MotionFlex = motion(Flex);

function PublicViewPageWrapper({ profileData, children }) {
  const location = useLocation();

  const sideBarStatus = useSelector(selectSidebarStatus);
  const isAuthenticated = useSelector(selectAuthenticationStatus);

  const marginLeft = useBreakpointValue({
    base: 0,
    md: sideBarStatus ? '260px' : '72px',
  });

  return (
    <Flex minH={'100vh'} maxW={'100vw'}>
      <SideBar />

      <Navbar profileData={profileData} />

      <TopBar profileData={profileData} />

      <AnimatePresence exitBeforeEnter>
        <MotionFlex
          key={location.key}
          direction={'column'}
          grow={1}
          mt={[isAuthenticated ? '56px' : '104px', '64px']}
          mb={'80px'}
          initial={'hidden'}
          animate={'visible'}
          exit={'hidden'}
          zIndex={0}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              marginLeft,
            },
          }}
        >
          <Box
            w={['100vw', '100%']}
            pt={'24px'}
            pb={'32px'}
            px={['20px', 0]}
            mx={'auto'}
          >
            {children}
          </Box>
        </MotionFlex>
      </AnimatePresence>
      <Footer />
    </Flex>
  );
}

export default PublicViewPageWrapper;

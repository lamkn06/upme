import { Flex, useBreakpointValue, Container } from '@chakra-ui/react';
import loadable from '@loadable/component';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  selectAuthenticationStatus,
  selectSidebarStatus,
} from '../../slices/user';

const Footer = loadable(() => import('./Footer'));
const Navbar = loadable(() => import('../Menu/Navbar'));
const SideBar = loadable(() => import('../Menu/Sidebar'));
const TopBar = loadable(() => import('../Menu/TopBar'));

const MotionFlex = motion(Flex);

function PageWrapper({ children }) {
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

      <Navbar />

      <TopBar />

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
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              marginLeft,
            },
          }}
        >
          <Container
            maxW={{ sm: '730px' }}
            pt={'24px'}
            pb={'32px'}
            px={{ base: '20px', lg: 0 }}
            mx={'auto'}
          >
            {children}
          </Container>
        </MotionFlex>
      </AnimatePresence>

      <Footer />
    </Flex>
  );
}

export default PageWrapper;

import { Box, Center, VStack } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ReactComponent as ScrollIcon } from '../../images/icons/scroll-down.svg';
import { ReactComponent as ChevronIcon } from '../../images/icons/u_angle-up.svg';
import { selectSidebarStatus } from '../../slices/user';

const MotionBox = motion(Box);
const MotionCenter = motion(Center);
const MotionVStack = motion(VStack);

const variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

function Footer() {
  const [ sidebarStatus ] = [ useSelector(selectSidebarStatus) ];
  const [bottomStatus, setBottomStatus] = useState(false);
  const [scrollToTopStatus, setScrollToTopStatus] = useState(false);
  const { t } = useTranslation();
  const onPageScroll = useCallback((e) => {
    setBottomStatus(
      e.target.documentElement.scrollHeight -
        e.target.documentElement.scrollTop ===
        e.target.documentElement.clientHeight
    );
    setScrollToTopStatus(
      document.body.scrollTop > 20 || document.documentElement.scrollTop > 20
    );
  }, []);
  const onScrollToTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  useEffect(() => {
    window.addEventListener('scroll', onPageScroll);
    return () => {
      window.removeEventListener('scroll', onPageScroll);
    };
  }, [onPageScroll]);

  return (
    <Box
      h={'80px'}
      w={['100vw', sidebarStatus ? 'calc(100% - 260px)' : 'calc(100% - 72px)']}
      pos={'fixed'}
      bottom={0}
      right={0}
      _before={
        bottomStatus
          ? {}
          : {
              bg: 'white',
              content: '" "',
              h: '280px',
              w: [
                '100vw',
                sidebarStatus ? 'calc(100% - 260px)' : 'calc(100% - 72px)',
              ],
              pos: 'fixed',
              bottom: 0,
              right: 0,
              maskImage: 'linear-gradient(to top, white 20%, transparent 100%)',
              pointerEvents: 'none',
              zIndex: -1,
            }
      }
    >
      <AnimatePresence>
        {scrollToTopStatus ? (
          <MotionCenter
            bg={'white'}
            boxShadow={'4px 8px 16px rgba(0, 0, 0, 0.1)'}
            boxSize={'48px'}
            cursor={'pointer'}
            pos={'fixed'}
            bottom={'26px'}
            right={'30px'}
            rounded={'full'}
            zIndex={1}
            onClick={onScrollToTop}
            initial={'hidden'}
            animate={'visible'}
            exit={'hidden'}
            variants={variants}
          >
            <ChevronIcon fill={'black'} height={38.4} width={38.4} />
          </MotionCenter>
        ) : (
          <MotionVStack
            pos={'fixed'}
            bottom={'34px'}
            left={[
              '50%',
              `calc(50% + (${sidebarStatus ? '270px' : '72px'}) / 2)`,
            ]}
            transform={'translateX(-50%)'}
            spacing={'8px'}
            initial={'hidden'}
            animate={'visible'}
            exit={'hidden'}
            variants={variants}
          >
            <MotionBox as={ScrollIcon}  w={'16px'}/>
            <Box fontSize={12}>{t('ScrollDown')}</Box>
          </MotionVStack>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default Footer;

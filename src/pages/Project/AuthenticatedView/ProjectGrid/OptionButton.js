import { Button, chakra } from '@chakra-ui/react';

const OptionButton = chakra(Button, {
  baseStyle: {
    bg: 'none',
    h: '24px',
    minW: 'auto',
    p: 0,
    textAlign: 'left',
    textTransform: 'none',
    w: 'fit-content',
    _hover: {
      bg: 'none',
      color: 'primary',
    },
  },
});

export default OptionButton;

import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    transparent: 'transparent',
    primary: '#06DCFF',
    primaryBG: '#F8F8F9',
    mono1: '#3F4647',
    mono2: '#C1C9CD',
    mono3: '#DBE1E5',
    Alert: '#F03D3E',
    progressBar: { 500: '#06DCFF' },
    checkbox_um: {
      400: '#06DCFF',
      500: '#06DCFF',
    },
  },
  fonts: {
    heading: 'Roboto',
    body: 'Roboto',
  },
  fontSizes: {
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '34px',
    '4xl': '48px',
    '5xl': '60px',
    '6xl': '120px',
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  components: {
    Button: {
      baseStyle: {
        rounded: 2,
        textTransform: 'uppercase',
        fontWeight: 'semibold',
      },
      sizes: {
        md: {
          fontSize: 'lg',
        },
        lg: {
          fontSize: 'xl',
        },
      },
      variants: {
        primary: {
          bgColor: 'primary',
          h: '40px',
          _hover: {
            bgColor: '#6EE5F9',
          },
        },
        secondary: {
          border: '1px solid #C8CFD3',
          h: '40px',
          fontStyle: 'buttonPrimary',
        },
        unstyled: {
          textTransform: 'none',
          color: 'primary',
        },
        link: {
          textTransform: 'none',
          color: 'primary',
        },
      },
    },
    FormLabel: {
      baseStyle: {
        fontSize: 'lg',
        fontWeight: 'normal',
      },
    },
    Input: {
      sizes: {
        md: {
          field: {
            fontSize: 'lg',
            h: '48px',
          },
        },
      },
      variants: {
        outline: {
          field: {
            rounded: 2,
            _focus: {
              borderColor: '#06DCFF',
              boxShadow: '0 0 0 1px #06DCFF',
            },
          },
        },
      },
    },
    Textarea: {
      sizes: {
        md: {
          fontSize: 'lg',
        },
      },
      variants: {
        outline: {
          rounded: 2,
          _focus: {
            borderColor: '#06DCFF',
            boxShadow: '0 0 0 1px #06DCFF',
          },
        },
      },
    },
    Heading: {
      variants: {
        h1: {
          fontStyle: 'normal',
          fontWeight: 'extrabold',
          fontSize: '6xl',
          lineHeight: '120px',
          letterSpacing: '-1.5px',
        },
        h2: {
          fontStyle: 'normal',
          fontWeight: 'extrabold',
          fontSize: '5xl',
          lineHeight: '75px',
        },
        h3: {
          fontStyle: 'normal',
          fontWeight: 'extrabold',
          fontSize: '4xl',
          lineHeight: '60px',
        },
        h4: {
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: '3xl',
          lineHeight: '42px',
          letterSpacing: '0.25px',
        },
        h5: {
          fontStyle: 'normal',
          fontWeight: 'bold',
          fontSize: '2xl',
          lineHeight: '32px',
        },
        h6: {
          fontStyle: 'normal',
          fontWeight: 'medium',
          fontSize: 'xl',
          lineHeight: '24px',
        },
      },
    },
    Text: {
      variants: {
        displayName: {
          fontWeight: 'semibold',
          fontSize: 'lg',
          lineHeight: '24px',
          letterSpacing: '0.44px',
        },
        bodyBig: {
          fontWeight: 'normal',
          fontSize: 'xl',
          lineHeight: '30px',
          letterSpacing: '0.15px',
        },
        body1: {
          fontWeight: 'normal',
          fontSize: 'lg',
          lineHeight: '24px',
          letterSpacing: '0.44px',
        },
        body2: {
          fontWeight: 'semibold',
          fontSize: 'md',
          lineHeight: '20px',
          letterSpacing: '0.25px',
        },
        subtitle1: {
          fontWeight: 'medium',
          fontSize: 'lg',
          lineHeight: '22px',
          letterSpacing: '0.1px',
        },
        subtitle2: {
          fontWeight: 'normal',
          fontSize: 'md',
          lineHeight: '22px',
          letterSpacing: '0.1px',
        },
        caption: {
          fontWeight: 'normal',
          fontSize: 'sm',
          lineHeight: '16px',
          letterSpacing: '0.4px',
        },
        overline: {
          fontWeight: 'bold',
          fontSize: 'xs',
          lineHeight: '16px',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
        },
      },
    },
    Tooltip: {
      baseStyle: {
        fontSize: 'lg',
      },
    },
    Checkbox: {},
  },
  styles: {
    global: {
      html: {
        scrollBehavior: 'smooth',
      },
      body: {
        '::-webkit-scrollbar, *::-webkit-scrollbar': {
          width: '16px',
          background: '#F8F8F9',
        },
        '::-webkit-scrollbar-thumb, *::-webkit-scrollbar-thumb': {
          background: '#DBE1E6',
          border: '3px solid transparent',
          borderRadius: '24px',
          backgroundClip: 'content-box',
        },
        // bg: 'white',
        // color: 'black',
      },
      'input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active':
        {
          boxShadow: '0 0 0 30px white inset !important',
        },
      '.react-datepicker-wrapper': {
        w: '100%',
      },
      '.react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range, .react-datepicker__month-text--selected, .react-datepicker__month-text--in-selecting-range, .react-datepicker__month-text--in-range, .react-datepicker__quarter-text--selected, .react-datepicker__quarter-text--in-selecting-range, .react-datepicker__quarter-text--in-range, .react-datepicker__year-text--selected, .react-datepicker__year-text--in-selecting-range, .react-datepicker__year-text--in-range':
        {
          bgColor: '#06DCFF',
        },
      '.react-datepicker__day--keyboard-selected': {
        bg: '#06DCFF',
        _hover: {
          bg: '#06DCFF',
        },
      },
      '.react-datepicker__month-select': {
        _focusVisible: {
          outlineColor: '#06DCFF',
        },
      },
      '.react-datepicker__year-select': {
        _focusVisible: {
          outlineColor: '#06DCFF',
        },
      },
    },
  },
  layerStyles: {
    labelButtonPrimary: {
      display: 'block',
      lineHeight: '40px',
      width: '100%',
      height: '100%',
      textAlign: 'center',
      verticalAlign: 'middle',
      cursor: 'pointer',
      bg: 'primary',
      h: '40px',
      textTransform: 'uppercase',
      _hover: {
        bg: '#6debff',
      },
      transitionProperty: 'common',
      transitionDuration: 'normal',
    },
    skillLevel: {
      bg: '#F8F8F9',
      flexBasis: '20%',
      cursor: 'pointer',
      h: '24px',
      position: 'relative',
      _hover: {
        bg: 'primary',
        opacity: '0.05',
        _after: {
          display: 'none',
        },
      },
      _after: {
        content: '""',
        position: 'absolute',
        right: 0,
        top: '4px',
        height: '16px',
        width: '1px',
        borderRight: '0.5px solid',
        borderColor: 'mono3',
      },
      _last: {
        _after: {
          display: 'none',
        },
      },
    },
    skillLevelSelected: {
      bg: 'primary',
      flexBasis: '20%',
      cursor: 'pointer',
      h: '24px',
      position: 'relative',
    },
  },
  textStyles: {
    buttonPrimary: {
      fontSize: 'lg',
      fontWeight: 'semibold',
      textTransform: 'uppercase',
    },
  },
  initialColorMode: 'light',
  useSystemColorMode: false,
});

export default theme;

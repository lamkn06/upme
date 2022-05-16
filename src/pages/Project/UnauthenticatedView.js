import { Box, Button, Image, Text, useBoolean } from '@chakra-ui/react';
import loadable from '@loadable/component';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Background from '../../images/assets/project.png';

const SignInModal = loadable(() => import('../../components/SignInModal'));

function UnauthenticatedView() {
  const { t } = useTranslation();
  const [signInModalStatus, setSignInModalStatus] = useBoolean();

  return (
    <Box>
      <Text fontSize={20}>
        {t('Please sign in/register to create project')}
      </Text>

      <Button
        variant={'primary'}
        h={'48px'}
        w={'166px'}
        mt={'48px'}
        mb={'106px'}
        onClick={setSignInModalStatus.on}
      >
        {t('Login Now')}
      </Button>

      <Image src={Background} />

      <SignInModal
        isOpen={signInModalStatus}
        onOpen={setSignInModalStatus.on}
        onClose={setSignInModalStatus.off}
      />
    </Box>
  );
}

export default UnauthenticatedView;

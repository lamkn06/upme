import {
  Box,
  Container,
  HStack,
  Heading,
  chakra,
  Text,
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ReactComponent as CheckIcon } from '../../images/icons/u_check.svg';

const Subscribe = loadable(() => import('../../components/Subscribe'));

function Blog() {
  const { t } = useTranslation();

  return (
    <Box flexGrow={1}>
      <Heading
        as={'h5'}
        variant={'h5'}
        textAlign={'left'}
        mt={'40px'}
        mb={'40px'}
      >
        <Trans>
          Upme Blog <chakra.span color={'#06DCFF'}>Coming Soon</chakra.span>
        </Trans>
      </Heading>

      <Container
        maxW={'350px'}
        fontSize={'16px'}
        fontWeight={'normal'}
        mx={0}
        px={0}
      >
        <HStack>
          <Box as={CheckIcon} fill={'#06DCFF'} />
          <Box>{t('Share your stories')}</Box>
        </HStack>

        <HStack>
          <Box as={CheckIcon} fill={'#06DCFF'} />
          <Box>{t('Note down your development journal')}</Box>
        </HStack>

        <HStack>
          <Box as={CheckIcon} fill={'#06DCFF'} />
          <Box>{t('Podcast, To-do list')}</Box>
        </HStack>

        <Text variant={'displayName'} mt={'12px'}>
          {t('And more, with Upme Blog!')}
        </Text>
      </Container>

      <Subscribe />
    </Box>
  );
}

export default Blog;

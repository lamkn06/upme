import {
  Box,
  Flex,
  Heading,
} from '@chakra-ui/react';
import React from 'react';
import loadable from '@loadable/component';
import { useTranslation } from 'react-i18next';

const ExperienceItem = loadable(() => import('./Item'));

function PublicViewExperience({ data }) {
  const { experiences } = data;
  const { t } = useTranslation();

  const renderExperience = () => {
    if (!experiences?.length || experiences.length === 0) return null;
    return experiences.map(( experience, index )=> {
      return (<ExperienceItem
                key={`experienceItem_${index}`}
                experience={experience}
                itemIndex={index} />
              );
    })
  }

  return (
    <Flex grow={1} py={'40px'} direction={'column'}>
          <Heading flexGrow={1}
            as={'h5'}
            mt={'48px'}
            mb={'48px'}
            variant={'h5'}
          >{t('Experience')}
          </Heading>
          <Box flexGrow={1}>
          {renderExperience()}
        </Box>
    </Flex>
  );
}

export default PublicViewExperience;

import {
  Box,
  Heading,
} from '@chakra-ui/react';
import React from 'react';
import loadable from '@loadable/component';
import { useTranslation } from 'react-i18next';

const EducationItem = loadable(() => import('./Item'));

function PublicViewEducation({ data }) {
  const { educations } = data;
  const { t } = useTranslation();

  const renderEducation = () => {
    if (!educations?.length || educations.length === 0) return null;
    return educations.map(( education, index )=> {
      return (<EducationItem
                key={`educationItem_${index}`}
                education={education}
                itemIndex={index} />
              );
    })
  }

  return (
    <Box
      flexGrow={1} py={'40px'}
    >
      <Heading
        as={'h5'}
        mt={'48px'}
        mb={'48px'}
        variant={'h5'}
      >{t('Education')}
      </Heading>
      {renderEducation()}
    </Box>
  );
}

export default PublicViewEducation;

import { Box, Text } from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import borderImg from '../../../../images/pvItemBorder.png';
import bulletImg from '../../../../images/pvEducationItemBullet.png';

function EducationItem({ education, itemIndex }) {
  const { t } = useTranslation();

  const getEducationHeader = () => {
    if (education) {
      const degree =
        education.degree || t('Degree {{index}}', { index: itemIndex + 1 });
      const institution =
        education.institution &&
        t(' at {{institution}}', {
          institution: education.institution,
        });

      return (
        <>
          <span color={'primary'}>{degree}</span>
          {institution}
        </>
      );
    }

    return null;
  };

  return (
    <Box
      sx={{
        paddingLeft: '24px',
        paddingBottom: '48px',
        position: 'relative',
        borderLeftStyle: 'solid',
        borderLeftWidth: '4px',
        borderImage: `url(${borderImg}) 4 repeat`,
        _before: {
          content: '""',
          position: 'absolute',
          left: '-10px',
          top: '-4px',
          height: '24px',
          backgroundImage: `url(${bulletImg})`,
          width: '16px',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'white',
          backgroundPosition: 'bottom',
        },
        _last: {
          borderStyle: 'none',
          paddingLeft: '28px',
          _before: {
            left: '-5px',
          },
        },
      }}
    >
      <Text
        fontWeight={'semibold'}
        fontSize={'lg'}
        lineHeight={'24px'}
        mb={'4px'}
      >
        {getEducationHeader()}
      </Text>
      <Text
        fontWeight={'normal'}
        fontSize={'md'}
        lineHeight={'24px'}
        mb={'12px'}
      >
        <>
          {education.educateFrom
            ? moment(education.educateFrom).format('DD/MM/YYYY')
            : '?'}
          {' - '}
          {education.educateTo
            ? moment(education.educateTo).format('DD/MM/YYYY')
            : '?'}
        </>
      </Text>
    </Box>
  );
}

export default EducationItem;

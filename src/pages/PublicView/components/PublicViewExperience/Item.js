import {
  Flex,
  Box,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactQuill from 'react-quill';

function ExperienceItem({ experience }) {
  const { t } = useTranslation();

  const getEndDate = () => {
    if (experience.isCurrent) return t('Present')
    return experience.endDate
      ? moment(experience.endDate).format('YYYY')
      : '?';
  }

  return (
    <Box
      sx={
        {
          paddingLeft: [0, '24px'],
          paddingBottom: '48px',
          position: 'relative',
        }
      }
    >
      <Flex //Header
        direction={['column', 'row']}
        pos={'relative'}
        fontWeight={'medium'}
        fontSize={'md'}
        mb={'16px'}
        alignItems={'baseline'}
      >
        <Box
          pos={'relative'}
          display={'inline-block'}
          minHeight={'32px'}
          marginBottom={['12px', 0]}
          width={'fit-content'}
          p={'4px 26px'}
          border={'solid 1px #C1C9CD'}
          borderRadius={'16px'}
          background={'white'}
          mr={'12px'}
        >
          <>
            {experience.startDate
              ? moment(experience.startDate).format('YYYY')
              : '?'}
            {' - '}
            {getEndDate()}
          </>
        </Box>
        <Box>
          <Box display={'inline-block'} mr={'8px'} color={'primary'}>
            {experience.company || '?'}
          </Box>
          <Box display={'inline-block'}>
            {experience.location && (t('at') + experience.location)}
          </Box>
        </Box>
      </Flex>
      
      <Text fontSize={'lg'} fontWeight={'medium'} mb={'8px'}>
        {experience.position}
      </Text>
      <Box fontWeight={'normal'} fontSize={'md'}>
        { experience.description && 
        (<ReactQuill
        readOnly
        theme={'bubble'}
        modules={{
          toolbar: false,
        }}
        value={experience.description}
        />)
      }
      </Box>      
    </Box>
  );
}

export default ExperienceItem;

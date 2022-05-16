import {
  Box,
  Progress,
  Heading,
  Text,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useLanguageLevels from '../../../../hooks/useLanguageLevels';


function PublicViewSkill({ data, showLevel }) {
  const { skills, languages } = data;
  const { t } = useTranslation();
  const languagesLevels = useLanguageLevels();

  const renderSkill = () => {
    if (!skills?.length || skills.length === 0) return null;
    return skills.map(( skill, index )=> {
      return (<Box
                key={`SkillItem_${index}`}>
                  <Text variant={'body2'} mb={'16px'}>{skill.name || t('Skill {{index}}', { index: index + 1 })}</Text>
                  {showLevel && (<Progress
                    value={skill.level * 20}
                    border={'1px solid #DBE1E6'}
                    background={'none'}
                    borderRadius={'24px'}
                    h={'16px'}
                    padding={'4px'}
                    colorScheme={'progressBar'}
                    />)}
                </Box>
              );
    })
  }

  const renderLanguage = () => {
    if (!languages?.length || languages.length === 0) return null;
    return languages.map(( language, index )=> {
      return (<Flex direction={'column'}
                key={`LanguageItem_${index}`}>
                  <Text
                    fontSize={'24px'}
                    fontWeight={'bold'}
                    color={'primary'}
                    mb={'16px'}>{language.name || t('Language {{index}}', { index: index + 1 })}</Text>
                  {showLevel && (<Text variant={'body2'}>
                    {languagesLevels[language.level - 1].label}
                  </Text>)}
                </Flex>
              );
    })
  }

  return (
    <Box flexGrow={1} py={'40px'}>
      { skills?.length > 0 && (
      <>
        <Heading
          as={'h5'}
          mt={'48px'}
          mb={'48px'}
          variant={'h5'}
        >{t('Skill')}
        </Heading>
        <SimpleGrid
          columns={[1, 2]}
          spacingX={[0, '30px']}
          spacingY={'32px'}
          flexFlow={'row wrap'}
          mb={'48px'}
        >
          {renderSkill()}
        </SimpleGrid>
      </>
      )}
      {languages?.length > 0 && (
      <>
        <Heading
          as={'h5'}
          mt={'48px'}
          mb={'48px'}
          variant={'h5'}
        >{t('Language')}
        </Heading>
        <SimpleGrid
          columns={[1, 2]}
          spacingX={[0, '30px']}
          spacingY={'32px'}
          flexFlow={'row wrap'}
        >
          {renderLanguage()}
        </SimpleGrid>
      </>
      )}
    </Box>
  );
}

export default PublicViewSkill;

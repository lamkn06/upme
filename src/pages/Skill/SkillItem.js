import {
  Box,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import React, { memo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ReactComponent as AngleDownIcon } from '../../images/icons/u_angle-down.svg';
import { ReactComponent as AngleUpIcon } from '../../images/icons/u_angle-up.svg';
import { ReactComponent as TrashIcon } from '../../images/icons/u_trash-alt.svg';

const SkillItem = ({ index, showLevel, remove, defaultIsOpen }) => {
  const { t } = useTranslation();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen });
  const { register, setValue, control } = useFormContext();
  const skills = useWatch({ control, name: 'skills' });

  return (
    <Box border={'1px solid #C8CFD3'} mt={'16px'} mb={'24px'} p={'16px'}>
      <Flex mb={'4px'}>
        <Flex align={'center'}>
          <Text variant={'displayName'} mr={'4px'}>
            {skills && skills.length && skills[index].name
              ? skills[index].name
              : t('Skill {{index}}', { index: index + 1 })}
          </Text>

          <TrashIcon
            fill={'#C8CFD3'}
            width={'16px'}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              remove(index);
            }}
          />
        </Flex>

        {isOpen ? (
          <AngleUpIcon
            fill={'#C8CFD3'}
            width={'24px'}
            style={{ cursor: 'pointer', marginLeft: 'auto' }}
            onClick={onToggle}
          />
        ) : (
          <AngleDownIcon
            fill={'#C8CFD3'}
            width={'24px'}
            style={{ cursor: 'pointer', marginLeft: 'auto' }}
            onClick={onToggle}
          />
        )}
      </Flex>

      { showLevel && (<Text variant={'subtitle2'}>
        {skills && skills.length > 0 && skills[index].level}/5
      </Text>)}

      <Collapse in={isOpen} animateOpacity>
        <SimpleGrid columns={[1, 2]} spacing={'16px'} mt={'16px'}>
          <FormControl>
            <FormLabel mb={'4px'}>{t('Skill Name')}</FormLabel>

            <Input
              {...register(`skills.${index}.name`)}
              borderRadius={2}
              h={'48px'}
              placeholder="eg. Project Management"
            />
          </FormControl>

          {showLevel && (
            <FormControl>
              <FormLabel mb={'4px'}>{t('Level')}</FormLabel>

              <input type={'hidden'} {...register(`skills.${index}.level`)} />

              <Flex align={'center'} h={'48px'} w={'100%'}>
                <Box
                  layerStyle={
                    skills[index].level >= 1
                      ? 'skillLevelSelected'
                      : 'skillLevel'
                  }
                  onClick={() => {
                    setValue(`skills.${index}.level`, 1);
                  }}
                />
                <Box
                  layerStyle={
                    skills[index].level >= 2
                      ? 'skillLevelSelected'
                      : 'skillLevel'
                  }
                  onClick={() => {
                    setValue(`skills.${index}.level`, 2);
                  }}
                />
                <Box
                  layerStyle={
                    skills[index].level >= 3
                      ? 'skillLevelSelected'
                      : 'skillLevel'
                  }
                  onClick={() => {
                    setValue(`skills.${index}.level`, 3);
                  }}
                />
                <Box
                  layerStyle={
                    skills[index].level >= 4
                      ? 'skillLevelSelected'
                      : 'skillLevel'
                  }
                  onClick={() => {
                    setValue(`skills.${index}.level`, 4);
                  }}
                />
                <Box
                  layerStyle={
                    skills[index].level === 5
                      ? 'skillLevelSelected'
                      : 'skillLevel'
                  }
                  onClick={() => {
                    setValue(`skills.${index}.level`, 5);
                  }}
                />
              </Flex>
            </FormControl>
          )}
        </SimpleGrid>
      </Collapse>
    </Box>
  );
};

export default memo(SkillItem);

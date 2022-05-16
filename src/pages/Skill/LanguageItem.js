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
import React, { memo, useMemo } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import useLanguageLevels from '../../hooks/useLanguageLevels';
import { ReactComponent as AngleDownIcon } from '../../images/icons/u_angle-down.svg';
import { ReactComponent as AngleUpIcon } from '../../images/icons/u_angle-up.svg';
import { ReactComponent as TrashIcon } from '../../images/icons/u_trash-alt.svg';

const LanguageItem = ({
  index,
  name,
  level,
  showLevel,
  remove,
  defaultIsOpen,
}) => {
  const { t } = useTranslation();
  const languageLevels = useLanguageLevels();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen });
  const { register, control, watch } = useFormContext();
  const { field } = useController({
    name: `languages.${index}.level`,
    control,
    rules: { required: t('Level is required') },
    defaultValue: level,
  });

  const languageWatch = watch(`languages.${index}.level`);

  const languageLevel = useMemo(() => {
    const selectedLevel = languageLevels.find(
      (option) => option.value === languageWatch
    );
    return selectedLevel ? selectedLevel.label : '';
  }, [languageLevels, languageWatch]);

  return (
    <Box border={'1px solid #C8CFD3'} mt={'16px'} mb={'24px'} p={'16px'}>
      <Flex mb={'4px'}>
        <Flex align={'center'}>
          <Text variant={'displayName'} mr={'4px'}>
            {name ? t(name) : t('Language {{index}}', { index: index + 1 })}
          </Text>

          <TrashIcon
            fill={'#C8CFD3'}
            width={'16px'}
            style={{ cursor: 'pointer' }}
            onClick={remove}
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

      {showLevel && languageLevel && (
        <Text variant={'subtitle2'} textTransform={'capitalize'}>
          {languageLevel}
        </Text>
      )}

      <Collapse in={isOpen} animateOpacity>
        <SimpleGrid columns={[1, 2]} spacing={'16px'} mt={'16px'}>
          <FormControl>
            <FormLabel mb={'4px'}>{t('Language')}</FormLabel>

            <Input
              {...register(`languages.${index}.name`)}
              borderRadius={2}
              h={'48px'}
              placeholder={t('e.g English')}
            />
          </FormControl>

          {showLevel && (
            <FormControl>
              <FormLabel mb={'4px'}>{t('Level')}</FormLabel>

              <Select
                isSearchable={false}
                styles={{
                  control: (provided, state) => {
                    return {
                      ...provided,
                      borderColor: state.isFocused ? '#06DCFF' : '#E2E8F0',
                      boxShadow: state.isFocused ? '0 0 0 1px #06dcff' : 'none',
                      borderRadius: 2,
                      height: 48,
                      ':hover': {
                        borderColor: state.isFocused ? '#06DCFF' : '#CBD5E0',
                      },
                    };
                  },
                  indicatorSeparator: (provided) => ({
                    ...provided,
                    display: 'none',
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    paddingTop: 0,
                    paddingBottom: 0,
                    fontSize: 'lg',
                  }),
                  option: (provided) => ({
                    ...provided,
                    backgroundColor: 'none',
                    color: '#3F4647',
                    ':hover': {
                      color: '#06DCFF',
                      cursor: 'pointer',
                    },
                  }),
                }}
                options={languageLevels}
                value={languageLevels.find((g) => g.value === field.value)}
                onChange={(option) => {
                  field.onChange(option.value);
                }}
              />
            </FormControl>
          )}
        </SimpleGrid>
      </Collapse>
    </Box>
  );
};

export default memo(LanguageItem);

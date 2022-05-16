import {
  Box,
  Collapse,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
import DatePicker from 'react-datepicker';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ReactComponent as AngleDownIcon } from '../../images/icons/u_angle-down.svg';
import { ReactComponent as AngleUpIcon } from '../../images/icons/u_angle-up.svg';
import { ReactComponent as CalendarIcon } from '../../images/icons/u_calendar-alt.svg';
import { ReactComponent as TrashIcon } from '../../images/icons/u_trash-alt.svg';

function EducationItem({ index, remove, defaultIsOpen }) {
  const { t } = useTranslation();
  const { register, control, getValues } = useFormContext();
  const educations = useWatch({
    control,
    name: 'educations',
  });
  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen,
  });
  const getEducationHeader = () => {
    const education = educations[index];

    if (education) {
      const degree =
        education.degree || t('Degree {{index}}', { index: index + 1 });
      const institution =
        education.institution &&
        t(' at {{institution}}', {
          institution: education.institution,
        });

      return degree + institution;
    }

    return null;
  };

  return (
    <Box border={'1px solid #C8CFD3'} mt={'16px'} mb={'24px'} p={'16px'}>
      <Flex mb={'4px'}>
        <Flex align={'center'}>
          <Text variant={'displayName'} mr={'4px'}>
            {getEducationHeader()}
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

      <Text variant={'subtitle2'}>
        {educations[index] && (
          <>
            {educations[index].educateFrom && moment(educations[index].educateFrom).format('DD/MM/YYYY')}
            {educations[index].educateFrom &&
            educations[index].educateTo && ' - '}
            {educations[index].educateTo && moment(educations[index].educateTo).format('DD/MM/YYYY')}
          </>
          )}
      </Text>

      <Collapse in={isOpen} animateOpacity>
        <SimpleGrid columns={[1, 2]} spacing={'16px'} mt={'16px'}>
          <FormControl>
            <FormLabel mb={'4px'}>{t('Degree')}</FormLabel>

            <Input {...register(`educations.${index}.degree`)} />
          </FormControl>

          <FormControl>
            <FormLabel mb={'4px'}>{t('Institution')}</FormLabel>

            <Input {...register(`educations.${index}.institution`)} />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight={400} mr={0}>
              {t('From')}
              <Controller
                render={({ field: { value, onChange } }) => (
                  <InputGroup mt={'4px'}>
                    <Input
                      as={DatePicker}
                      dateFormat="dd/MM/yyyy"
                      maxDate={getValues([`educations.${index}.educateTo`])[0]}
                      showPopperArrow={false}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode={'select'}
                      selected={value && moment(value).toDate()}
                      onChange={(date) => {
                        onChange(date);
                      }}
                    />
                    <InputRightElement
                      h={'48px'}
                      children={<CalendarIcon fill={'#C8CFD3'} />}
                    />
                  </InputGroup>
                )}
                name={`educations.${index}.educateFrom`}
                control={control}
              />
            </FormLabel>
          </FormControl>

          <FormControl>
            <FormLabel fontWeight={400} mr={0}>
              {t('To')}
              <Controller
                render={({ field: { value, onChange } }) => {
                  return (
                    <InputGroup mt={'4px'}>
                      <Input
                        as={DatePicker}
                        dateFormat="dd/MM/yyyy"
                        minDate={
                          getValues([`educations.${index}.educateFrom`])[0]
                        }
                        showPopperArrow={false}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode={'select'}
                        selected={value && moment(value).toDate()}
                        onChange={(date) => {
                          onChange(date);
                        }}
                      />
                      <InputRightElement
                        h={'48px'}
                        children={<CalendarIcon fill={'#C8CFD3'} />}
                      />
                    </InputGroup>
                  );
                }}
                name={`educations.${index}.educateTo`}
                control={control}
              />
            </FormLabel>
          </FormControl>
        </SimpleGrid>
      </Collapse>
    </Box>
  );
}

export default EducationItem;

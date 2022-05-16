import { Box, Button, Heading } from '@chakra-ui/react';
import loadable from '@loadable/component';
import { debounce } from 'lodash/function';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as PlusIcon } from '../../images/icons/u_plus.svg';
import {
  selectLocalProfile,
  selectToggleFetchProfile,
  setProfile,
} from '../../slices/profile';

const EducationItem = loadable(() => import('./Item'));

function Education() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [defaultOpenItems, setDefaultOpenItems] = useState([]);
  const toggleFetchProfile = useSelector(selectToggleFetchProfile);
  const initialToggleFetchProfile = useRef(toggleFetchProfile);
  const methods = useForm({
    defaultValues: { educations: [] },
  });
  const { reset, control } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'educations',
  });
  const educations = useWatch({
    name: 'educations',
    control,
  });
  const debounced = useRef(
    debounce((payload) => {
      dispatch(
        setProfile({
          educations: payload.map((i) => ({
            ...i,
            educateFrom: i.educateFrom && i.educateFrom.toString(),
            educateTo: i.educateTo && i.educateTo.toString(),
          })),
        })
      );
    }, 1000)
  );
  const setDefaultValue = useCallback(() => {
    const res = dispatch(selectLocalProfile());

    reset({
      educations: res.educations.map((i) => ({
        ...i,
        educateFrom: i.educateFrom && new Date(i.educateFrom),
        educateTo: i.educateTo && new Date(i.educateTo),
      })),
    });
  }, [dispatch, reset]);

  useEffect(() => {
    setDefaultValue();
  }, [dispatch, reset, setDefaultValue]);

  useEffect(
    function resetDefaultValueWhenToggleFetchProfile() {
      if (initialToggleFetchProfile.current !== toggleFetchProfile) {
        initialToggleFetchProfile.current = toggleFetchProfile;
        setDefaultValue();
      }
    },
    [toggleFetchProfile, reset, dispatch, setDefaultValue]
  );

  useEffect(() => {
    debounced.current(educations);
  }, [educations]);

  return (
    <Box flexGrow={1} pt={'16px'}>
      <Heading size="lg" fontSize="24px" mb={'16px'}>
        {t('Education')}
      </Heading>

      <FormProvider {...methods}>
        {fields.map((field, index) => (
          <EducationItem
            key={field.id}
            {...{ index }}
            remove={remove}
            defaultIsOpen={defaultOpenItems.findIndex((i) => index === i) > -1}
          />
        ))}

        <Button
          bg={'none'}
          borderRadius={2}
          textTransform={'none'}
          _focus={{
            bg: '#F8F8F9',
            color: '#06DCFF',
            svg: {
              fill: '#06DCFF',
            },
          }}
          _hover={{
            bg: '#F8F8F9',
            color: '#06DCFF',
            svg: {
              fill: '#06DCFF',
            },
          }}
          onClick={() => {
            append({
              degree: '',
              institution: '',
              educateFrom: null,
              educateTo: null,
            });
            setDefaultOpenItems([...defaultOpenItems, educations.length]);
          }}
        >
          <Box as={PlusIcon} fill={'#3F4647'} w={'20px'} mr={'16px'} />
          <Box>{t('Add New')}</Box>
        </Button>
      </FormProvider>
    </Box>
  );
}

export default Education;

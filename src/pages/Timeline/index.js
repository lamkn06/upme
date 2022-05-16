import { Box, Button, Heading } from '@chakra-ui/react';
import loadable from '@loadable/component';
import debounce from 'lodash/debounce';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import { ReactComponent as PlusIcon } from '../../images/icons/u_plus.svg';
import { fetchLocalProfile, setProfile } from '../../slices/profile';

const TimelineItem = loadable(() => import('./Item'));

function Timeline() {
  const { t } = useTranslation();
  const [defaultOpenItems, setDefaultOpenItems] = useState([]);
  const dispatch = useDispatch();
  const methods = useForm({
    defaultValues: {
      timeline: [],
    },
  });
  const {
    formState: { isDirty },
    watch,
    reset,
    control,
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'timeline',
  });
  const watchAllField = watch();

  const debounced = useRef(
    debounce((newTimeline) => {
      dispatch(
        setProfile({
          timeline: newTimeline.map((t) => ({
            ...t,
            startDate: t.startDate && t.startDate.toString(),
            endDate: t.endDate && t.endDate.toString(),
          })),
        })
      );
    }, 1000)
  );

  const setDefaultValue = useCallback(() => {
    dispatch(fetchLocalProfile())
      .unwrap()
      .then((res) => {
        reset({
          timeline: res.timeline.map((t) => ({
            ...t,
            startDate: t.startDate && new Date(t.startDate),
            endDate: t.endDate && new Date(t.endDate),
          })),
        });
      });
  }, [dispatch, reset]);

  useEffect(() => {
    setDefaultValue();
  }, [setDefaultValue]);

  useEffect(() => {
    if (isDirty) {
      debounced.current(watchAllField.timeline);
    }
  }, [isDirty, watchAllField]);

  return (
    <Box flexGrow={1} pt={'16px'}>
      <Heading size="lg" fontSize="24px" mb={'16px'}>
        {t('Timeline')}
      </Heading>

      <FormProvider {...methods}>
        {fields.map((field, index) => (
          <TimelineItem
            key={field.id}
            {...{ index, remove, watchAll: field }}
            defaultIsOpen={defaultOpenItems.findIndex((i) => index === i) > -1}
          />
        ))}

        <Button
          bg={'none'}
          borderRadius={2}
          textTransform={'none'}
          _hover={{
            bg: '#F8F8F9',
            color: '#06DCFF',
            svg: {
              fill: '#06DCFF',
            },
          }}
          _focus={{}}
          onClick={() => {
            append({
              position: '',
              company: '',
              startDate: null,
              endDate: null,
              location: '',
              description: '',
            });
            setDefaultOpenItems([
              ...defaultOpenItems,
              watchAllField.timeline ? watchAllField.timeline.length : 0,
            ]);
          }}
        >
          <PlusIcon
            fill={'#3F4647'}
            width={'20px'}
            style={{ marginRight: 16 }}
          />
          <Box>{t('Add New')}</Box>
        </Button>
      </FormProvider>
    </Box>
  );
}

export default Timeline;

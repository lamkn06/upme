import {
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Textarea,
  Heading,
  Box,
} from '@chakra-ui/react';
import { debounce } from 'lodash/function';
import React, { useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectLocalProfile,
  selectToggleFetchProfile,
  setProfile,
} from '../../slices/profile';

function AboutMe() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const toggleFetchProfile = useSelector(selectToggleFetchProfile);
  const initialToggleFetchProfile = useRef(toggleFetchProfile);
  const {
    register,
    formState: { isDirty },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      personalStatement: '',
    },
  });
  const aboutMe = watch();
  const debounced = useRef(
    debounce((payload) => {
      dispatch(setProfile(payload));
    }, 1000)
  );

  useEffect(() => {
    if (isDirty) {
      debounced.current({ ...aboutMe });
      reset(aboutMe);
    }
  }, [aboutMe, isDirty, reset]);

  const setDefaultValue = useCallback(() => {
    const {
      personalStatement,
      fullName,
      position,
      email,
      phoneNumber,
      location,
    } = dispatch(selectLocalProfile());

    reset({
      personalStatement,
      fullName,
      position,
      email,
      phoneNumber,
      location,
    });
  }, [dispatch, reset]);

  useEffect(() => {
    setDefaultValue();
  }, [dispatch, setDefaultValue, reset]);

  useEffect(
    function resetDefaultValueWhenToggleFetchProfile() {
      if (initialToggleFetchProfile.current !== toggleFetchProfile) {
        initialToggleFetchProfile.current = toggleFetchProfile;
        setDefaultValue();
      }
    },
    [toggleFetchProfile, reset, dispatch, setDefaultValue]
  );

  return (
    <Box flexGrow={1}>
      <Heading size="lg" fontSize="24px" mt={'26px'} mb={'16px'}>
        {t('Personal Statement')}
      </Heading>

      <FormControl
        // isInvalid={aboutMe.personalStatement.length === 500}
        mb={'40px'}
        position={'relative'}
      >
        <Box
          color={
            aboutMe.personalStatement.length === 500 ? '#E53E3E' : '#C1C9CD'
          }
          position={'absolute'}
          bottom={0}
          right={'5px'}
          fontSize={'14px'}
        >
          {aboutMe.personalStatement.length}/500
        </Box>
        <Textarea
          {...register('personalStatement')}
          maxLength={500}
          paddingBottom={'20px'}
          borderRadius={2}
          resize={'none'}
          placeholder={t('Write something about your self')}
          sx={{
            '::-webkit-scrollbar': {
              w: 0,
            },
          }}
        />
      </FormControl>

      <Heading size="lg" fontSize="24px" mb={'16px'}>
        {t('Contact Details')}
      </Heading>

      <SimpleGrid columns={[1, 2]} spacing={'16px'}>
        <FormControl id="full-name">
          <FormLabel mb={'4px'}>{t('Full name')}</FormLabel>

          <Input
            {...register('fullName')}
            borderRadius={2}
            h={'48px'}
            placeholder="eg. John Doe"
          />
        </FormControl>

        <FormControl id="position">
          <FormLabel mb={'4px'}>{t('Position')}</FormLabel>

          <Input
            {...register('position')}
            borderRadius={2}
            h={'48px'}
            placeholder="eg. Project Manager"
          />
        </FormControl>

        <FormControl id="email">
          <FormLabel mb={'4px'}>{t('Email')}</FormLabel>
          <Input
            {...register('email', {
              // required: t('Please input a valid email format'),
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                message: t('Please input a valid email format'),
              },
            })}
            borderRadius={2}
            h={'48px'}
            type="email"
            placeholder="eg. john.doe@upme.cloud"
          />
        </FormControl>

        <FormControl id="phone">
          <FormLabel mb={'4px'}>{t('Phone')}</FormLabel>
          <Input
            {...register('phoneNumber')}
            borderRadius={2}
            h={'48px'}
            placeholder="eg. 0938223490"
          />
        </FormControl>
      </SimpleGrid>

      <FormControl id="address" mt={'16px'}>
        <FormLabel mb={'4px'}>{t('Address')}</FormLabel>
        <Input
          {...register('location')}
          borderRadius={2}
          h={'48px'}
          placeholder="eg. 56 Nguyen Dinh Chieu, HCMC"
        />
      </FormControl>
    </Box>
  );
}

export default AboutMe;

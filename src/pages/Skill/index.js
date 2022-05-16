import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Switch,
  Heading,
} from '@chakra-ui/react';
import loadable from '@loadable/component';
import { debounce } from 'lodash/function';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ReactComponent as PlusIcon } from '../../images/icons/u_plus.svg';
import {
  fetchLocalProfile,
  selectToggleFetchProfile,
  selectShowLevel,
  setProfile,
  setShowLevel
} from '../../slices/profile';

const SkillItem = loadable(() => import('./SkillItem'));
const LanguageItem = loadable(() => import('./LanguageItem'));

function Skill() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [defaultOpenSkillItems, setDefaultOpenSkillItems] = useState([]);
  const [defaultOpenLanguageItems, setDefaultOpenLanguageItems] = useState([]);
  const showLevel = useSelector(selectShowLevel);
  const toggleFetchProfile = useSelector(selectToggleFetchProfile);
  const initialToggleFetchProfile = useRef(toggleFetchProfile);
  const methods = useForm({
    defaultValues: {
      skills: [],
      languages: [],
    },
  });
  const {
    formState: { isDirty, isValid },
    watch,
    reset,
    control,
  } = methods;
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: 'skills',
  });
  const {
    fields: languageFields,
    append: appendLanguage,
    remove: removeLanguage,
  } = useFieldArray({
    control,
    name: 'languages',
  });
  const formValues = watch();
  const debounced = useRef(
    debounce((payload) => {
      dispatch(setProfile(payload));
    }, 1000)
  );

  const handleShowLevelChange = (e) => {
    const newVal = e.target.checked;
    dispatch(setShowLevel(newVal));
  }

  const setDefaultValue = useCallback(() => {
    dispatch(fetchLocalProfile())
      .unwrap()
      .then((res) => {
        reset({ skills: res.skills, languages: res.languages });
      });
  }, [dispatch, reset]);

  useEffect(() => {
    if (showLevel === undefined) {
      dispatch(setShowLevel(true));
    }
  }, [showLevel]);

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
    if (isDirty && isValid) {
      const { skills, languages } = formValues;

      debounced.current({
        skills: skills.map((i) => ({ ...i })),
        languages: languages.map((i) => ({ ...i })),
      });
    }
  }, [formValues, isDirty, isValid]);

  return (
    <Box flexGrow={1}>
      <FormProvider {...methods}>
        <FormControl display="flex" alignItems="center" mt={'40px'} mb={'24px'}>
          <Switch
            sx={{
              '.chakra-switch__track': {
                bg: 'white',
                border: '1px solid #CBD5DC',
                _checked: {
                  bg: 'primary',
                  borderColor: 'primary',
                  '.chakra-switch__thumb': {
                    bg: 'white',
                  },
                },
                '.chakra-switch__thumb': {
                  bg: '#C8CFD3',
                },
              },
            }}
            isChecked={showLevel}
            onChange={handleShowLevelChange}
          />

          <FormLabel ml={'8px'} mb={0}>
            {t('Show level on your resume')}
          </FormLabel>
        </FormControl>

        <Heading size="lg" fontSize="24px" mb={'16px'}>
          {t('Skills')}
        </Heading>

        {skillFields.map((s, idx) => (
          <SkillItem
            key={s.id}
            index={idx}
            showLevel={showLevel}
            remove={removeSkill}
            defaultIsOpen={
              defaultOpenSkillItems.findIndex((i) => idx === i) > -1
            }
          />
        ))}

        <Button
          bg={'none'}
          borderRadius={2}
          textTransform={'none'}
          mb={'40px'}
          _hover={{
            bg: '#F8F8F9',
            color: '#06DCFF',
            svg: {
              fill: '#06DCFF',
            },
          }}
          onClick={() => {
            appendSkill({ name: '', level: 3 });
            setDefaultOpenSkillItems((prevState) => {
              return [...prevState, formValues.skills.length];
            });
          }}
        >
          <Box as={PlusIcon} fill={'#3F4647'} boxSize={'20px'} mr={'16px'} />
          <Box>{t('Add New')}</Box>
        </Button>

        <Heading size="lg" fontSize="24px" mb={'16px'}>
          {t('Languages')}
        </Heading>

        {[...languageFields].map((s, idx) => (
          <LanguageItem
            key={s.id}
            {...{
              ...s,
              index: idx,
              showLevel,
              remove: () => {
                removeLanguage(idx);
              },
              defaultIsOpen:
                defaultOpenLanguageItems.findIndex((i) => idx === i) > -1,
            }}
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
          onClick={() => {
            appendLanguage({ name: '', level: 4 });
            setDefaultOpenLanguageItems((prevState) => {
              return [...prevState, formValues.languages.length];
            });
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

export default Skill;

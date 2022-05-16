import React, { useState } from 'react';
import Select from 'react-select';
import { useTranslation } from 'react-i18next';

const languageOptions = [
  { value: 'en', label: 'EN' },
  { value: 'vi', label: 'VN' },
];

const SelectLanguage = ({ isMobile = false }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    i18n.language === 'en-US' ? 'en' : i18n.language
  );
  const changeLanguageHandler = (lang) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <Select
      isSearchable={false}
      menuPortalTarget={document.body}
      styles={{
        control: (provided, state) => {
          return {
            ...provided,
            border: 'none',
            boxShadow: state.isFocused ? '0 0 0 1px #06dcff' : 'none',
            height: 40,
            width: 78,
            marginTop: 8,
            ':hover': {
              borderColor: state.isFocused ? '#06DCFF' : '#CBD5E0',
            },
          };
        },
        indicatorsContainer: (provided) => ({
          ...provided,
          svg: {
            color: 'black',
          },
        }),
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
        valueContainer: (provided) => ({
          ...provided,
          fontWeight: 500,
          padding: 0,
        }),
      }}
      options={languageOptions}
      value={languageOptions.find((c) => c.value === currentLanguage)}
      onChange={(val) => {
        changeLanguageHandler(val.value);
      }}
    />
  );
};

export default SelectLanguage;

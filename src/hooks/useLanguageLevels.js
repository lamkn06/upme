import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export default function useLanguageLevels() {
  const { t } = useTranslation();
  return useMemo(
    () => [
      { value: 1, label: t('Beginner') },
      { value: 2, label: t('High Beginner') },
      { value: 3, label: t('Low Intermediate') },
      { value: 4, label: t('Intermediate') },
      { value: 5, label: t('High Intermediate') },
      { value: 6, label: t('Low Advanced') },
      { value: 7, label: t('Advanced') },
    ],
    [t]
  );
}

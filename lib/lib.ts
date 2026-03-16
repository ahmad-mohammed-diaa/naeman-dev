type TranslationType = { language: 'EN' | 'AR'; name: string };

export const TranslateName = <T extends { translation: TranslationType[] }>(
  data: T,
  language: 'EN' | 'AR',
) => {
  const { translation, ...rest } = data;
  return {
    ...rest,
    nameEN: translation.find((t) => t.language === 'EN')?.name,
    nameAR: translation.find((t) => t.language === 'AR')?.name,
    name: translation.find((t) => t.language === language)?.name,
  };
};

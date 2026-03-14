type TranslationType = { language: 'EN' | 'AR'; name: string };

export const TranslateName = <T extends { Translation: TranslationType[] }>(
  data: T,
  language: 'EN' | 'AR',
) => {
  const { Translation, ...rest } = data;
  return {
    ...rest,
    nameEN: Translation.find((t) => t.language === 'EN')?.name,
    nameAR: Translation.find((t) => t.language === 'AR')?.name,
    name: Translation.find((t) => t.language === language)?.name,
  };
};

import { Language } from 'generated/prisma/client';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export const createTranslation = <
  T extends {
    translation: { name: string; language: string; description?: string }[];
  },
>(
  data: T,
) => ({
  createMany: {
    data: data.translation.map((translation) => ({
      name: translation.name,
      language: translation.language as Language,
      ...(translation.description && { description: translation.description }),
    })),
  },
});
export const updateTranslation = <
  T extends {
    translation?: {
      id?: string;
      name: string;
      language: string;
      description?: string;
    }[];
  },
>(
  data: T,
) => {
  if (!data.translation || !Array.isArray(data.translation)) {
    return {};
  }

  const updates = data.translation.map((translation) => ({
    where: { language: translation.language as Language },
    data: {
      name: translation.name,
      language: translation.language as Language,
      ...(translation.description && {
        description: translation.description,
      }),
    },
  }));
  return updates.length ? { updateMany: updates } : {};
};

export const Translation = (des?: boolean, language?: Language) => {
  return {
    translation: {
      ...(language && { where: { language: Language[language] } }),
      select: {
        name: true,
        language: true,
        ...(des && { description: true }),
      },
    },
  };
};

export const translationDes = (language?: Language) => {
  return {
    translation: {
      ...(language && { where: { language: Language[language] } }),
      select: {
        name: true,
        language: true,
        description: true,
      },
    },
  };
};

export class translationDto {
  @IsString()
  id?: string;

  @IsString()
  @Transform(({ value }) => value ?? null)
  name: string;

  @IsString()
  @Transform(({ value }) => Language[value.toUpperCase()] ?? null)
  language: Language;

  @IsString()
  @Transform(({ value }) => value ?? null)
  @IsOptional()
  description?: string;
}

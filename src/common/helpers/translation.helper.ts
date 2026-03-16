import { Language } from 'generated/prisma/enums';
import { OmitFields } from './lib';

type TranslationRecord = {
  name: string;
  description?: string | null;
  language: Language;
};

const hasTranslation = (
  value: unknown,
): value is { translation: TranslationRecord[] } =>
  !!value &&
  typeof value === 'object' &&
  'translation' in value &&
  Array.isArray((value as Record<string, unknown>).translation);

// Returns the translation for the given language, falling back to the first entry.
const pickTranslation = (translations: TranslationRecord[], lang?: Language) =>
  (lang ? translations.find((t) => t.language === lang) : undefined) ??
  translations[0];

// ─── Overloads ────────────────────────────────────────────────────────────────

export function deepMapWithTranslation<T, K extends keyof T>(
  items: T[],
  lang?: Language,
  keys?: Exclude<K, 'translation'>[],
): Omit<T & { name: string; description?: string }, 'translation' | K>[];

export function deepMapWithTranslation<T, K extends keyof T>(
  items: T,
  lang?: Language,
  keys?: Exclude<K, 'translation'>[],
): Omit<T & { name: string; description?: string }, 'translation' | K>;

// ─── Implementation ───────────────────────────────────────────────────────────

export function deepMapWithTranslation<T, K extends keyof T>(
  items: T[] | T,
  lang?: Language,
  keys?: Exclude<K, 'translation'>[],
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter = (data: any): any => {
    if (!data || typeof data !== 'object') return data;
    if (Array.isArray(data)) return data.map(filter);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;

    if (hasTranslation(data)) {
      const { translation, ...rest } = data;
      result = keys?.length
        ? OmitFields(rest as any, ...(keys as any[]))
        : { ...rest };
      const t = pickTranslation(translation, lang);
      if (t) {
        result.name = t.name;
        if (t.description) result.description = t.description;
      }
    } else {
      result = { ...data };
    }

    // Always recurse into every child — even nodes without translation
    // may contain deeply nested children that do have translations.
    for (const key in result) {
      const value = result[key];
      if (value && typeof value === 'object') {
        result[key] = filter(value);
      }
    }

    return result;
  };

  return Array.isArray(items) ? items.map(filter) : filter(items);
}

// ─── Helper to get Language enum from accept-language string ──────────────────
// Usage in services: const lang = parseLang(I18nContext.current()?.lang);
export const parseLang = (lang?: string): Language =>
  lang?.toLowerCase().startsWith('ar') ? Language.AR : Language.EN;

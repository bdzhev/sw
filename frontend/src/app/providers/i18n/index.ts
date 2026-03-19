import { useStorage } from '@vueuse/core';
import { createI18n } from 'vue-i18n';
import { type Router } from 'vue-router';

import { LanguageCodes } from '@shared/config/locale';

export const SUPPORTED_LOCALES = Object.values(LanguageCodes);
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
const FALLBACK_LOCALE = LanguageCodes.ENGLISH;

export const locale = useStorage<SupportedLocale>('locale', FALLBACK_LOCALE);

export const i18n = createI18n({
  locale: locale.value,
  fallbackLocale: FALLBACK_LOCALE,
  messages: {},
  globalInjection: true,
  legacy: false,
});

const loaded = new Set<string>();

export const loadLocaleMessages = async (
  locale: SupportedLocale,
  pageName: string,
) => {
  const key = `${locale}-${pageName}`;
  if (loaded.has(key)) {
    return;
  }

  try {
    const url = `/assets/locales/${locale}/${pageName}.json`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to load locale messages from ${url}`);
    }

    const messages = (await res.json()) as Record<string, string>;
    const existing = i18n.global.getLocaleMessage(locale) || {};

    i18n.global.setLocaleMessage(locale, { ...existing, ...messages });

    loaded.add(key);
  } catch (err) {
    console.warn(`[i18n] ${String(err)}`);
  }
};

const setI18nLanguage = (newLocale: SupportedLocale) => {
  locale.value = newLocale;
  i18n.global.locale.value = newLocale;
  document.documentElement.setAttribute('lang', newLocale);
};

export const setupLocaleGuard = (router: Router) => {
  router.beforeEach(async (to) => {
    const currentLocale = SUPPORTED_LOCALES.includes(locale.value)
      ? locale.value
      : FALLBACK_LOCALE;

    const pageName = to.name as string | undefined;

    if (pageName) {
      await loadLocaleMessages(currentLocale, pageName);
    }

    setI18nLanguage(currentLocale);
    return true;
  });
};

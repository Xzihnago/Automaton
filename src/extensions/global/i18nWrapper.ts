import { Locale } from "discord.js";

type TI18nPartial = Record<
  string,
  Partial<Record<Exclude<Locale, Locale.EnglishUS>, string>> & Record<Locale.EnglishUS, string>
>;

type TI18n<T extends TI18nPartial> = Record<keyof T, Record<Locale, string>>;

const i18nWrapper = <T extends TI18nPartial>(i18n: T) => {
  for (const key in i18n) {
    i18n[key] = new Proxy(i18n[key], {
      get: (target, locale: Locale) => target[locale] ?? target[Locale.EnglishUS],
    });
  }

  return i18n as TI18n<T>;
};

export default i18nWrapper;

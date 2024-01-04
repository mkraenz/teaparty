import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const httpApi = new HttpApi(null, {
  loadPath: '/locales/{{lng}}/{{ns}}.json',
});
const createI18n = () => {
  i18next
    .use(httpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      load: 'languageOnly', // avoid fetching all translation files
      lng: import.meta.env.NODE_ENV === 'test' ? 'citest' : undefined, // if you're using a language detector, do not define the lng option
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      fallbackLng: 'en',
      appendNamespaceToCIMode: true,
    });
  return i18next;
};

export default createI18n;

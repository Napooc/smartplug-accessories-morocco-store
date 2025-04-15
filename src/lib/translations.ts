import { generalTranslations } from './general';
import { productTranslations } from './product';
import { categoryTranslations } from './category';
import { cartTranslations } from './cart';
import { checkoutTranslations } from './checkout';
import { adminTranslations } from './admin';
import { seoTranslations } from './seo';
import { contactTranslations } from './contact';
import { aboutTranslations } from './about';
import { galleryTranslations } from './additionalTranslations';

export const translations = {
  en: {
    ...generalTranslations.en,
    ...productTranslations.en,
    ...categoryTranslations.en,
    ...cartTranslations.en,
    ...checkoutTranslations.en,
    ...adminTranslations.en,
    ...seoTranslations.en,
    ...contactTranslations.en,
    ...aboutTranslations.en,
    ...galleryTranslations.en,
  },
  fr: {
    ...generalTranslations.fr,
    ...productTranslations.fr,
    ...categoryTranslations.fr,
    ...cartTranslations.fr,
    ...checkoutTranslations.fr,
    ...adminTranslations.fr,
    ...seoTranslations.fr,
    ...contactTranslations.fr,
    ...aboutTranslations.fr,
    ...galleryTranslations.fr,
  },
  ar: {
    ...generalTranslations.ar,
    ...productTranslations.ar,
    ...categoryTranslations.ar,
    ...cartTranslations.ar,
    ...checkoutTranslations.ar,
    ...adminTranslations.ar,
    ...seoTranslations.ar,
    ...contactTranslations.ar,
    ...aboutTranslations.ar,
    ...galleryTranslations.ar,
  }
};

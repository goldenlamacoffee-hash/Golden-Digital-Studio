import type { Locale } from './config'

/**
 * UI chrome strings (nav, buttons, labels). Editable page CONTENT lives in the
 * database; this dictionary only covers static interface text.
 */
export type Dictionary = {
  nav: {
    services: string
    portfolio: string
    packages: string
    contact: string
  }
  cta: {
    primary: string
    secondary: string
    getStarted: string
    viewWork: string
    backHome: string
  }
  contact: {
    name: string
    email: string
    company: string
    budget: string
    message: string
    submit: string
    submitting: string
    success: string
    error: string
    required: string
  }
  footer: {
    rights: string
    builtBy: string
  }
}

const en: Dictionary = {
  nav: {
    services: 'Services',
    portfolio: 'Portfolio',
    packages: 'Packages',
    contact: 'Contact',
  },
  cta: {
    primary: 'Start a project',
    secondary: 'See our work',
    getStarted: 'Get started',
    viewWork: 'View portfolio',
    backHome: 'Back to home',
  },
  contact: {
    name: 'Name',
    email: 'Email',
    company: 'Company',
    budget: 'Budget',
    message: 'Message',
    submit: 'Send inquiry',
    submitting: 'Sending…',
    success: "Thank you — we'll be in touch within one business day.",
    error: 'Something went wrong. Please try again.',
    required: 'This field is required',
  },
  footer: {
    rights: 'All rights reserved.',
    builtBy: 'by',
  },
}

const cs: Dictionary = {
  nav: {
    services: 'Služby',
    portfolio: 'Portfolio',
    packages: 'Balíčky',
    contact: 'Kontakt',
  },
  cta: {
    primary: 'Začít projekt',
    secondary: 'Naše práce',
    getStarted: 'Začít',
    viewWork: 'Zobrazit portfolio',
    backHome: 'Zpět na úvod',
  },
  contact: {
    name: 'Jméno',
    email: 'E-mail',
    company: 'Společnost',
    budget: 'Rozpočet',
    message: 'Zpráva',
    submit: 'Odeslat poptávku',
    submitting: 'Odesílání…',
    success: 'Děkujeme — ozveme se vám do jednoho pracovního dne.',
    error: 'Něco se pokazilo. Zkuste to prosím znovu.',
    required: 'Toto pole je povinné',
  },
  footer: {
    rights: 'Všechna práva vyhrazena.',
    builtBy: 'od',
  },
}

const sk: Dictionary = {
  nav: {
    services: 'Služby',
    portfolio: 'Portfólio',
    packages: 'Balíky',
    contact: 'Kontakt',
  },
  cta: {
    primary: 'Začať projekt',
    secondary: 'Naše práce',
    getStarted: 'Začať',
    viewWork: 'Zobraziť portfólio',
    backHome: 'Späť na úvod',
  },
  contact: {
    name: 'Meno',
    email: 'E-mail',
    company: 'Spoločnosť',
    budget: 'Rozpočet',
    message: 'Správa',
    submit: 'Odoslať dopyt',
    submitting: 'Odosielanie…',
    success: 'Ďakujeme — ozveme sa vám do jedného pracovného dňa.',
    error: 'Niečo sa pokazilo. Skúste to znova.',
    required: 'Toto pole je povinné',
  },
  footer: {
    rights: 'Všetky práva vyhradené.',
    builtBy: 'od',
  },
}

const dictionaries: Record<Locale, Dictionary> = {
  en,
  'cs-CZ': cs,
  'sk-SK': sk,
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en
}

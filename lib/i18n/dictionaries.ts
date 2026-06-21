import type { Locale } from './config'

/**
 * UI chrome strings (nav, buttons, labels). Editable page CONTENT lives in the
 * database; this dictionary only covers static interface text.
 */
export type Dictionary = {
  hero: {
    badge: string
    titleLead: string
    titleHighlight: string
    description: string
    tagline: string
  }
  sections: {
    services: { eyebrow: string; title: string; description: string }
    portfolio: { eyebrow: string; title: string; description: string }
    packages: { eyebrow: string; title: string; description: string }
  }
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
  hero: {
    badge: 'A digital studio by',
    titleLead: 'Websites, apps and AI systems for',
    titleHighlight: 'ambitious small businesses.',
    description:
      'Golden Digital Studio builds practical digital systems — websites with CMS, B2B portals, mobile apps, automations and AI workflows — under LMVK Group.',
    tagline: 'Digital systems. AI workflows. Impact.',
  },
  sections: {
    services: {
      eyebrow: 'Services',
      title: 'Everything you need to run a modern digital business.',
      description:
        'One studio for the systems that matter — built to work together and easy to maintain.',
    },
    portfolio: {
      eyebrow: 'Portfolio',
      title: 'Proof in real systems and brands.',
      description:
        'Selected work across websites, portals and apps. Built to perform and ready for the next phase.',
    },
    packages: {
      eyebrow: 'Packages',
      title: 'Engagements scoped to where you are.',
      description:
        'Transparent starting points — every project is tailored after a short discovery call.',
    },
  },
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
  hero: {
    badge: 'Digitální studio od',
    titleLead: 'Weby, aplikace a AI systémy pro',
    titleHighlight: 'ambiciózní malé firmy.',
    description:
      'Golden Digital Studio staví praktické digitální systémy — weby s CMS, B2B portály, mobilní aplikace, automatizace a AI workflow — pod LMVK Group.',
    tagline: 'Digitální systémy. AI workflow. Výsledky.',
  },
  sections: {
    services: {
      eyebrow: 'Služby',
      title: 'Vše, co potřebujete k provozu moderní digitální firmy.',
      description:
        'Jedno studio pro systémy, na kterých záleží — navržené tak, aby fungovaly společně a snadno se udržovaly.',
    },
    portfolio: {
      eyebrow: 'Portfolio',
      title: 'Důkaz v reálných systémech a značkách.',
      description:
        'Vybrané práce napříč weby, portály a aplikacemi. Postavené na výkon a připravené na další fázi.',
    },
    packages: {
      eyebrow: 'Balíčky',
      title: 'Spolupráce přizpůsobená tomu, kde se nacházíte.',
      description:
        'Transparentní výchozí body — každý projekt je upraven po krátké úvodní konzultaci.',
    },
  },
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
  hero: {
    badge: 'Digitálne štúdio od',
    titleLead: 'Weby, aplikácie a AI systémy pre',
    titleHighlight: 'ambiciózne malé firmy.',
    description:
      'Golden Digital Studio stavia praktické digitálne systémy — weby s CMS, B2B portály, mobilné aplikácie, automatizácie a AI workflow — pod LMVK Group.',
    tagline: 'Digitálne systémy. AI workflow. Výsledky.',
  },
  sections: {
    services: {
      eyebrow: 'Služby',
      title: 'Všetko, čo potrebujete na prevádzku modernej digitálnej firmy.',
      description:
        'Jedno štúdio pre systémy, na ktorých záleží — navrhnuté tak, aby fungovali spoločne a ľahko sa udržiavali.',
    },
    portfolio: {
      eyebrow: 'Portfólio',
      title: 'Dôkaz v reálnych systémoch a značkách.',
      description:
        'Vybrané práce naprieč webmi, portálmi a aplikáciami. Postavené na výkon a pripravené na ďalšiu fázu.',
    },
    packages: {
      eyebrow: 'Balíky',
      title: 'Spolupráca prispôsobená tomu, kde sa nachádzate.',
      description:
        'Transparentné východiskové body — každý projekt je upravený po krátkej úvodnej konzultácii.',
    },
  },
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

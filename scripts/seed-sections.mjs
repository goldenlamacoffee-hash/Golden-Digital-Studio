/**
 * Seeds editable marketing SECTIONS for all three locales (en, cs-CZ, sk-SK).
 * Run with: node --env-file=/vercel/share/.env.project scripts/seed-sections.mjs
 *
 * Idempotent: ON CONFLICT (locale, key) DO UPDATE. The `data` column holds the
 * structured/repeatable content (cards, steps, footer columns, label maps).
 *
 * English mirrors SECTION_DEFAULTS in lib/cms/section-content.ts; the public
 * resolver falls back to those defaults when a row is missing, so the site
 * always renders. Seeding makes every string editable per-locale in the admin.
 */
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const K = {
  homeHero: 'home.hero',
  homePositioning: 'home.positioning',
  homeServices: 'home.services',
  homeWhyUs: 'home.why_us',
  homePortfolio: 'home.portfolio',
  homeProcess: 'home.process',
  homePackages: 'home.packages',
  homeAiTraining: 'home.ai_training',
  homeFinalCta: 'home.final_cta',
  servicesHero: 'page.services.hero',
  portfolioHero: 'page.portfolio.hero',
  contactHero: 'page.contact.hero',
  footer: 'layout.footer',
  portfolioLabels: 'portfolio.shared_labels',
}

// Order matches the visual order on the homepage for a clean admin list.
const ORDER = [
  K.homeHero, K.homePositioning, K.homeServices, K.homeWhyUs, K.homePortfolio,
  K.homeProcess, K.homePackages, K.homeAiTraining, K.homeFinalCta,
  K.servicesHero, K.portfolioHero, K.contactHero, K.footer, K.portfolioLabels,
]

const en = {
  [K.homeHero]: {
    eyebrow: 'A digital studio by',
    title: 'Websites, apps and AI systems for',
    body: 'Golden Digital Studio builds practical digital systems — websites with CMS, B2B portals, mobile apps, automations and AI workflows — under LMVK Group.',
    data: { titleHighlight: 'ambitious small businesses.', tagline: 'Digital systems. AI workflows. Impact.', primaryCta: 'Start a project', secondaryCta: 'See our work' },
  },
  [K.homePositioning]: {
    eyebrow: 'Positioning',
    title: 'From outdated websites and manual work to modern digital systems.',
    body: 'Most small businesses are held back by a slow website and a stack of manual tasks. Golden Digital Studio replaces that with clean, connected systems — built around how your business actually works, not around hype. The result is software that is faster to use, easier to maintain and ready to grow with you.',
    data: { items: [
      { value: 'CMS-first', label: 'You own and edit your content' },
      { value: 'Weeks', label: 'Typical time to a first launch' },
      { value: 'AI-assisted', label: 'Faster builds without cut corners' },
    ] },
  },
  [K.homeServices]: {
    eyebrow: 'Services',
    title: 'Everything you need to run a modern digital business.',
    body: 'One studio for the systems that matter — built to work together and easy to maintain.',
    data: {},
  },
  [K.homeWhyUs]: {
    eyebrow: 'Why us',
    title: 'A studio built for outcomes, not just deliverables.',
    body: 'We combine speed, real business sense and a modern toolkit — backed by the standards of LMVK Group.',
    data: { items: [
      { title: 'Fast delivery', body: 'Tight scopes and a modern stack mean you launch in weeks, not quarters.' },
      { title: 'Real business understanding', body: 'We design around how your business actually makes money and runs day to day.' },
      { title: 'Modern stack', body: 'Current, well-supported tools that stay fast, secure and easy to extend.' },
      { title: 'CMS-first thinking', body: 'You own your content. Edit pages, products and offers without calling us.' },
      { title: 'AI-assisted build process', body: 'We use AI to move faster and cut cost — without cutting quality or care.' },
      { title: 'Long-term maintenance', body: 'Systems are looked after, monitored and improved long after launch.' },
      { title: 'Built under LMVK Group', body: 'The reliability and standards of an established group, in a focused studio.' },
    ] },
  },
  [K.homePortfolio]: {
    eyebrow: 'Portfolio',
    title: 'Proof in real systems and brands.',
    body: 'Selected work across websites, portals and apps. Built to perform and ready for the next phase.',
    data: {},
  },
  [K.homeProcess]: {
    eyebrow: 'Process',
    title: 'A clear path from idea to a system you can run.',
    body: 'Five focused stages keep the work transparent, fast and easy to follow.',
    data: { items: [
      { step: '01', title: 'Discover', body: 'We map your goals, customers and current systems to find the highest-impact work.' },
      { step: '02', title: 'Design', body: 'We shape the structure, content and interface around a clear, premium experience.' },
      { step: '03', title: 'Build', body: 'We develop with a modern, AI-assisted process and keep you in the loop throughout.' },
      { step: '04', title: 'Launch', body: 'We ship carefully, test the full flow and hand over a system your team can run.' },
      { step: '05', title: 'Maintain', body: 'We monitor, update and iterate so the system keeps performing and growing.' },
    ] },
  },
  [K.homePackages]: {
    eyebrow: 'Packages',
    title: 'Engagements scoped to where you are.',
    body: 'Transparent starting points — every project is tailored after a short discovery call.',
    data: {},
  },
  [K.homeAiTraining]: {
    eyebrow: 'AI training',
    title: 'We can also train your team to work with AI.',
    body: 'Beyond building systems, Golden Digital Studio runs practical, hands-on training so your team can use modern AI tools with confidence — from everyday assistants to repeatable content and automation workflows.',
    data: { ctaLabel: 'Ask about training', items: [
      { title: 'ChatGPT & Claude', body: 'Use modern assistants confidently and safely for real daily work.' },
      { title: 'Canva & content', body: 'Produce on-brand visuals and content faster, without a design team.' },
      { title: 'AI content workflows', body: 'Repeatable processes for writing, summarising and research.' },
      { title: 'Practical automation', body: 'Hands-on training to remove repetitive tasks from your week.' },
    ] },
  },
  [K.homeFinalCta]: {
    eyebrow: "Let's build",
    title: 'Build fast. Build clean.',
    body: "Tell us where your business is today and where you want it to go. We'll map the highest-impact digital system to get you there.",
    data: { titleHighlight: 'Build golden.', primaryCta: 'Book a consultation', secondaryCta: 'View our work' },
  },
  [K.servicesHero]: {
    eyebrow: 'Services',
    title: 'Digital systems, built to work together.',
    body: 'From your first modern website to portals, apps and AI workflows — Golden Digital Studio delivers the systems ambitious small businesses need, with a CMS-first, AI-assisted approach.',
    data: {},
  },
  [K.portfolioHero]: {
    eyebrow: 'Portfolio',
    title: 'Work that turns into momentum.',
    body: "A selection of systems and brands we've shaped. Each one is built to perform today and ready to grow into its next phase.",
    data: {},
  },
  [K.contactHero]: {
    eyebrow: 'Contact',
    title: 'Start a project. Build something golden.',
    body: "Tell us where your business is today and what you want to build. We'll come back with a clear, practical next step — no jargon, no pressure.",
    data: {},
  },
  [K.footer]: {
    eyebrow: null,
    title: null,
    body: 'Practical digital systems — websites, portals, apps and AI workflows — for ambitious small businesses across Czech Republic, Slovakia, Austria.',
    data: {
      parentLine: 'A digital studio by LMVK Group',
      slogan: 'Build fast. Build clean. Build golden.',
      columns: [
        { title: 'Services', links: [
          { label: 'Websites & CMS', href: '/services#websites-cms' },
          { label: 'B2B portals', href: '/services#b2b-portals' },
          { label: 'Mobile apps', href: '/services#mobile-apps' },
          { label: 'AI workflows', href: '/services#ai-workflows' },
        ] },
        { title: 'Studio', links: [
          { label: 'Portfolio', href: '/portfolio' },
          { label: 'Contact', href: '/contact' },
          { label: 'Start a project', href: '/contact' },
        ] },
        { title: 'Legal', links: [
          { label: 'Privacy policy', href: '/contact' },
          { label: 'Terms of service', href: '/contact' },
          { label: 'Imprint', href: '/contact' },
        ] },
      ],
    },
  },
  [K.portfolioLabels]: {
    eyebrow: null, title: null, body: null,
    data: { signatureWork: 'Signature work', viewCaseStudy: 'View case study →', visitSite: 'Visit site ↗', allWork: 'All work', visitLiveSite: 'Visit live site' },
  },
}

const cs = {
  [K.homeHero]: { eyebrow: 'Digitální studio od', title: 'Weby, aplikace a AI systémy pro', body: 'Golden Digital Studio staví praktické digitální systémy — weby s CMS, B2B portály, mobilní aplikace, automatizace a AI workflow — pod LMVK Group.', data: { titleHighlight: 'ambiciózní malé firmy.', tagline: 'Digitální systémy. AI workflow. Výsledky.', primaryCta: 'Začít projekt', secondaryCta: 'Naše práce' } },
  [K.homePositioning]: { eyebrow: 'Positioning', title: 'Od zastaralých webů a ruční práce k moderním digitálním systémům.', body: 'Většinu malých firem brzdí pomalý web a hromada manuálních úkolů. Golden Digital Studio je nahradí čistými, propojenými systémy — postavenými podle toho, jak vaše firma skutečně funguje, ne podle trendů. Výsledkem je software, který je rychlejší, snáze se udržuje a roste s vámi.', data: { items: [
    { value: 'CMS-first', label: 'Obsah vlastníte a upravujete sami' },
    { value: 'Týdny', label: 'Typický čas k prvnímu spuštění' },
    { value: 'S podporou AI', label: 'Rychlejší vývoj bez kompromisů' },
  ] } },
  [K.homeServices]: { eyebrow: 'Služby', title: 'Vše, co potřebujete k provozu moderní digitální firmy.', body: 'Jedno studio pro systémy, na kterých záleží — navržené tak, aby fungovaly společně a snadno se udržovaly.', data: {} },
  [K.homeWhyUs]: { eyebrow: 'Proč my', title: 'Studio postavené na výsledcích, ne jen na dodávkách.', body: 'Spojujeme rychlost, skutečný obchodní smysl a moderní nástroje — se standardy LMVK Group.', data: { items: [
    { title: 'Rychlé dodání', body: 'Jasné zadání a moderní stack znamenají spuštění v týdnech, ne čtvrtletích.' },
    { title: 'Skutečné porozumění byznysu', body: 'Navrhujeme podle toho, jak vaše firma reálně vydělává a funguje každý den.' },
    { title: 'Moderní stack', body: 'Aktuální, dobře podporované nástroje, které zůstávají rychlé, bezpečné a snadno rozšiřitelné.' },
    { title: 'CMS-first přístup', body: 'Obsah patří vám. Upravujte stránky, produkty a nabídky bez volání nám.' },
    { title: 'Vývoj s podporou AI', body: 'AI používáme pro vyšší rychlost a nižší náklady — bez ztráty kvality a péče.' },
    { title: 'Dlouhodobá údržba', body: 'O systémy se staráme, monitorujeme je a vylepšujeme dlouho po spuštění.' },
    { title: 'Pod hlavičkou LMVK Group', body: 'Spolehlivost a standardy zavedené skupiny v soustředěném studiu.' },
  ] } },
  [K.homePortfolio]: { eyebrow: 'Portfolio', title: 'Důkaz v reálných systémech a značkách.', body: 'Vybrané práce napříč weby, portály a aplikacemi. Postavené na výkon a připravené na další fázi.', data: {} },
  [K.homeProcess]: { eyebrow: 'Proces', title: 'Jasná cesta od nápadu k systému, který zvládnete provozovat.', body: 'Pět soustředěných fází udržuje práci přehlednou, rychlou a srozumitelnou.', data: { items: [
    { step: '01', title: 'Objevování', body: 'Zmapujeme vaše cíle, zákazníky a současné systémy a najdeme práci s největším dopadem.' },
    { step: '02', title: 'Návrh', body: 'Tvarujeme strukturu, obsah a rozhraní kolem jasného, prémiového zážitku.' },
    { step: '03', title: 'Vývoj', body: 'Vyvíjíme moderním procesem s podporou AI a průběžně vás držíme v obraze.' },
    { step: '04', title: 'Spuštění', body: 'Nasazujeme pečlivě, testujeme celý tok a předáváme systém, který váš tým zvládne.' },
    { step: '05', title: 'Údržba', body: 'Monitorujeme, aktualizujeme a iterujeme, aby systém dál fungoval a rostl.' },
  ] } },
  [K.homePackages]: { eyebrow: 'Balíčky', title: 'Spolupráce přizpůsobená tomu, kde se nacházíte.', body: 'Transparentní výchozí body — každý projekt je upraven po krátké úvodní konzultaci.', data: {} },
  [K.homeAiTraining]: { eyebrow: 'AI školení', title: 'Můžeme také vyškolit váš tým v práci s AI.', body: 'Kromě stavby systémů vede Golden Digital Studio praktická školení, aby váš tým uměl s jistotou používat moderní AI nástroje — od každodenních asistentů po opakovatelná workflow pro obsah a automatizaci.', data: { ctaLabel: 'Zeptat se na školení', items: [
    { title: 'ChatGPT a Claude', body: 'Používejte moderní asistenty sebevědomě a bezpečně pro reálnou každodenní práci.' },
    { title: 'Canva a obsah', body: 'Tvořte vizuály a obsah v souladu se značkou rychleji, bez designového týmu.' },
    { title: 'AI workflow pro obsah', body: 'Opakovatelné procesy pro psaní, shrnování a rešerše.' },
    { title: 'Praktická automatizace', body: 'Praktické školení, jak odstranit opakující se úkoly z vašeho týdne.' },
  ] } },
  [K.homeFinalCta]: { eyebrow: 'Pojďme stavět', title: 'Stavte rychle. Stavte čistě.', body: 'Řekněte nám, kde je vaše firma dnes a kam ji chcete posunout. Navrhneme digitální systém s nejvyšším dopadem, který vás tam dostane.', data: { titleHighlight: 'Stavte zlatě.', primaryCta: 'Domluvit konzultaci', secondaryCta: 'Zobrazit naši práci' } },
  [K.servicesHero]: { eyebrow: 'Služby', title: 'Digitální systémy postavené tak, aby fungovaly společně.', body: 'Od prvního moderního webu po portály, aplikace a AI workflow — Golden Digital Studio dodává systémy, které ambiciózní malé firmy potřebují, s CMS-first a AI-asistovaným přístupem.', data: {} },
  [K.portfolioHero]: { eyebrow: 'Portfolio', title: 'Práce, která se mění v momentum.', body: 'Výběr systémů a značek, které jsme utvářeli. Každá je postavená na dnešní výkon a připravená růst do další fáze.', data: {} },
  [K.contactHero]: { eyebrow: 'Kontakt', title: 'Začněte projekt. Postavte něco zlatého.', body: 'Řekněte nám, kde je vaše firma dnes a co chcete postavit. Vrátíme se s jasným, praktickým dalším krokem — bez žargonu a bez tlaku.', data: {} },
  [K.footer]: { eyebrow: null, title: null, body: 'Praktické digitální systémy — weby, portály, aplikace a AI workflow — pro ambiciózní malé firmy v Česku, na Slovensku a v Rakousku.', data: {
    parentLine: 'Digitální studio od LMVK Group',
    slogan: 'Stavte rychle. Stavte čistě. Stavte zlatě.',
    columns: [
      { title: 'Služby', links: [
        { label: 'Weby a CMS', href: '/services#websites-cms' },
        { label: 'B2B portály', href: '/services#b2b-portals' },
        { label: 'Mobilní aplikace', href: '/services#mobile-apps' },
        { label: 'AI workflow', href: '/services#ai-workflows' },
      ] },
      { title: 'Studio', links: [
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Kontakt', href: '/contact' },
        { label: 'Začít projekt', href: '/contact' },
      ] },
      { title: 'Právní', links: [
        { label: 'Ochrana osobních údajů', href: '/contact' },
        { label: 'Obchodní podmínky', href: '/contact' },
        { label: 'Tiráž', href: '/contact' },
      ] },
    ],
  } },
  [K.portfolioLabels]: { eyebrow: null, title: null, body: null, data: { signatureWork: 'Vlajková práce', viewCaseStudy: 'Zobrazit případovou studii →', visitSite: 'Navštívit web ↗', allWork: 'Všechny práce', visitLiveSite: 'Navštívit živý web' } },
}

const sk = {
  [K.homeHero]: { eyebrow: 'Digitálne štúdio od', title: 'Weby, aplikácie a AI systémy pre', body: 'Golden Digital Studio stavia praktické digitálne systémy — weby s CMS, B2B portály, mobilné aplikácie, automatizácie a AI workflow — pod LMVK Group.', data: { titleHighlight: 'ambiciózne malé firmy.', tagline: 'Digitálne systémy. AI workflow. Výsledky.', primaryCta: 'Začať projekt', secondaryCta: 'Naše práce' } },
  [K.homePositioning]: { eyebrow: 'Positioning', title: 'Od zastaraných webov a ručnej práce k moderným digitálnym systémom.', body: 'Väčšinu malých firiem brzdí pomalý web a kopa manuálnych úloh. Golden Digital Studio ich nahradí čistými, prepojenými systémami — postavenými podľa toho, ako vaša firma naozaj funguje, nie podľa trendov. Výsledkom je softvér, ktorý je rýchlejší, ľahšie sa udržiava a rastie s vami.', data: { items: [
    { value: 'CMS-first', label: 'Obsah vlastníte a upravujete sami' },
    { value: 'Týždne', label: 'Typický čas k prvému spusteniu' },
    { value: 'S podporou AI', label: 'Rýchlejší vývoj bez kompromisov' },
  ] } },
  [K.homeServices]: { eyebrow: 'Služby', title: 'Všetko, čo potrebujete na prevádzku modernej digitálnej firmy.', body: 'Jedno štúdio pre systémy, na ktorých záleží — navrhnuté tak, aby fungovali spoločne a ľahko sa udržiavali.', data: {} },
  [K.homeWhyUs]: { eyebrow: 'Prečo my', title: 'Štúdio postavené na výsledkoch, nie len na dodávkach.', body: 'Spájame rýchlosť, skutočný obchodný zmysel a moderné nástroje — so štandardmi LMVK Group.', data: { items: [
    { title: 'Rýchle dodanie', body: 'Jasné zadania a moderný stack znamenajú spustenie v týždňoch, nie štvrťrokoch.' },
    { title: 'Skutočné porozumenie biznisu', body: 'Navrhujeme podľa toho, ako vaša firma reálne zarába a funguje každý deň.' },
    { title: 'Moderný stack', body: 'Aktuálne, dobre podporované nástroje, ktoré zostávajú rýchle, bezpečné a ľahko rozšíriteľné.' },
    { title: 'CMS-first prístup', body: 'Obsah patrí vám. Upravujte stránky, produkty a ponuky bez volania nám.' },
    { title: 'Vývoj s podporou AI', body: 'AI používame pre vyššiu rýchlosť a nižšie náklady — bez straty kvality a starostlivosti.' },
    { title: 'Dlhodobá údržba', body: 'O systémy sa staráme, monitorujeme ich a vylepšujeme dlho po spustení.' },
    { title: 'Pod hlavičkou LMVK Group', body: 'Spoľahlivosť a štandardy zavedenej skupiny v sústredenom štúdiu.' },
  ] } },
  [K.homePortfolio]: { eyebrow: 'Portfólio', title: 'Dôkaz v reálnych systémoch a značkách.', body: 'Vybrané práce naprieč webmi, portálmi a aplikáciami. Postavené na výkon a pripravené na ďalšiu fázu.', data: {} },
  [K.homeProcess]: { eyebrow: 'Proces', title: 'Jasná cesta od nápadu k systému, ktorý zvládnete prevádzkovať.', body: 'Päť sústredených fáz udržiava prácu prehľadnú, rýchlu a zrozumiteľnú.', data: { items: [
    { step: '01', title: 'Objavovanie', body: 'Zmapujeme vaše ciele, zákazníkov a súčasné systémy a nájdeme prácu s najväčším dopadom.' },
    { step: '02', title: 'Návrh', body: 'Tvarujeme štruktúru, obsah a rozhranie okolo jasného, prémiového zážitku.' },
    { step: '03', title: 'Vývoj', body: 'Vyvíjame moderným procesom s podporou AI a priebežne vás držíme v obraze.' },
    { step: '04', title: 'Spustenie', body: 'Nasadzujeme starostlivo, testujeme celý tok a odovzdávame systém, ktorý váš tím zvládne.' },
    { step: '05', title: 'Údržba', body: 'Monitorujeme, aktualizujeme a iterujeme, aby systém ďalej fungoval a rástol.' },
  ] } },
  [K.homePackages]: { eyebrow: 'Balíky', title: 'Spolupráca prispôsobená tomu, kde sa nachádzate.', body: 'Transparentné východiskové body — každý projekt je upravený po krátkej úvodnej konzultácii.', data: {} },
  [K.homeAiTraining]: { eyebrow: 'AI školenie', title: 'Vieme tiež vyškoliť váš tím v práci s AI.', body: 'Okrem stavby systémov vedie Golden Digital Studio praktické školenia, aby váš tím vedel s istotou používať moderné AI nástroje — od každodenných asistentov po opakovateľné workflow pre obsah a automatizáciu.', data: { ctaLabel: 'Opýtať sa na školenie', items: [
    { title: 'ChatGPT a Claude', body: 'Používajte moderných asistentov sebavedomo a bezpečne pre reálnu každodennú prácu.' },
    { title: 'Canva a obsah', body: 'Tvorte vizuály a obsah v súlade so značkou rýchlejšie, bez dizajnového tímu.' },
    { title: 'AI workflow pre obsah', body: 'Opakovateľné procesy pre písanie, sumarizáciu a rešerše.' },
    { title: 'Praktická automatizácia', body: 'Praktické školenie, ako odstrániť opakujúce sa úlohy z vášho týždňa.' },
  ] } },
  [K.homeFinalCta]: { eyebrow: 'Poďme stavať', title: 'Stavajte rýchlo. Stavajte čisto.', body: 'Povedzte nám, kde je vaša firma dnes a kam ju chcete posunúť. Navrhneme digitálny systém s najvyšším dopadom, ktorý vás tam dostane.', data: { titleHighlight: 'Stavajte zlato.', primaryCta: 'Dohodnúť konzultáciu', secondaryCta: 'Zobraziť našu prácu' } },
  [K.servicesHero]: { eyebrow: 'Služby', title: 'Digitálne systémy postavené tak, aby fungovali spoločne.', body: 'Od prvého moderného webu po portály, aplikácie a AI workflow — Golden Digital Studio dodáva systémy, ktoré ambiciózne malé firmy potrebujú, s CMS-first a AI-asistovaným prístupom.', data: {} },
  [K.portfolioHero]: { eyebrow: 'Portfólio', title: 'Práca, ktorá sa mení na momentum.', body: 'Výber systémov a značiek, ktoré sme formovali. Každá je postavená na dnešný výkon a pripravená rásť do ďalšej fázy.', data: {} },
  [K.contactHero]: { eyebrow: 'Kontakt', title: 'Začnite projekt. Postavte niečo zlaté.', body: 'Povedzte nám, kde je vaša firma dnes a čo chcete postaviť. Vrátime sa s jasným, praktickým ďalším krokom — bez žargónu a bez tlaku.', data: {} },
  [K.footer]: { eyebrow: null, title: null, body: 'Praktické digitálne systémy — weby, portály, aplikácie a AI workflow — pre ambiciózne malé firmy v Česku, na Slovensku a v Rakúsku.', data: {
    parentLine: 'Digitálne štúdio od LMVK Group',
    slogan: 'Stavajte rýchlo. Stavajte čisto. Stavajte zlato.',
    columns: [
      { title: 'Služby', links: [
        { label: 'Weby a CMS', href: '/services#websites-cms' },
        { label: 'B2B portály', href: '/services#b2b-portals' },
        { label: 'Mobilné aplikácie', href: '/services#mobile-apps' },
        { label: 'AI workflow', href: '/services#ai-workflows' },
      ] },
      { title: 'Štúdio', links: [
        { label: 'Portfólio', href: '/portfolio' },
        { label: 'Kontakt', href: '/contact' },
        { label: 'Začať projekt', href: '/contact' },
      ] },
      { title: 'Právne', links: [
        { label: 'Ochrana osobných údajov', href: '/contact' },
        { label: 'Obchodné podmienky', href: '/contact' },
        { label: 'Tiráž', href: '/contact' },
      ] },
    ],
  } },
  [K.portfolioLabels]: { eyebrow: null, title: null, body: null, data: { signatureWork: 'Vlajková práca', viewCaseStudy: 'Zobraziť prípadovú štúdiu →', visitSite: 'Navštíviť web ↗', allWork: 'Všetky práce', visitLiveSite: 'Navštíviť živý web' } },
}

const byLocale = { en, 'cs-CZ': cs, 'sk-SK': sk }

async function run() {
  for (const locale of Object.keys(byLocale)) {
    const rows = byLocale[locale]
    for (let i = 0; i < ORDER.length; i++) {
      const key = ORDER[i]
      const r = rows[key]
      if (!r) continue
      await pool.query(
        `INSERT INTO sections (locale, key, eyebrow, title, subtitle, body, data, sort_order, is_published)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,true)
         ON CONFLICT (locale, key) DO UPDATE SET
           eyebrow = EXCLUDED.eyebrow,
           title = EXCLUDED.title,
           subtitle = EXCLUDED.subtitle,
           body = EXCLUDED.body,
           data = EXCLUDED.data,
           sort_order = EXCLUDED.sort_order,
           updated_at = now()`,
        [locale, key, r.eyebrow ?? null, r.title ?? null, r.subtitle ?? null, r.body ?? null, JSON.stringify(r.data ?? {}), i],
      )
    }
    console.log(`Seeded sections for locale: ${locale} (${ORDER.length} rows)`)
  }
  await pool.end()
  console.log('Section seed complete.')
}

run().catch((err) => {
  console.error('Section seed failed:', err)
  process.exit(1)
})

/**
 * Centralized, typed content for Golden Digital Studio.
 *
 * Everything the marketing site renders lives here as plain data objects so it
 * can later be moved into a CMS / database with minimal refactoring. Each
 * exported collection maps cleanly to a future content model / table.
 */

export const site = {
  name: 'Golden Digital Studio',
  parent: 'LMVK Group',
  tagline: 'Digital systems. AI workflows. Impact.',
  shortTagline: 'Build fast. Build clean. Build golden.',
  description:
    'Golden Digital Studio builds practical digital systems — websites with CMS, B2B portals, mobile apps, automations and AI workflows — under LMVK Group.',
  email: 'hello@goldendigitalstudio.example',
  phone: '+000 000 000 000',
  regions: ['Czech Republic', 'Slovakia', 'Austria'],
} as const

export const nav: { label: string; href: string }[] = [
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },
]

export type Service = {
  slug: string
  title: string
  summary: string
  details: string[]
}

export const services: Service[] = [
  {
    slug: 'websites-cms',
    title: 'Websites & CMS',
    summary:
      'Fast, editorial websites with a content system your team can actually run.',
    details: [
      'Custom design aligned to your brand',
      'Editable content without a developer',
      'SEO-ready structure and performance',
    ],
  },
  {
    slug: 'b2b-portals',
    title: 'B2B portals',
    summary:
      'Client portals, dashboards and internal tools that replace spreadsheets.',
    details: [
      'Role-based access and accounts',
      'Order, quote and document flows',
      'Reporting and exports',
    ],
  },
  {
    slug: 'mobile-apps',
    title: 'Mobile apps',
    summary:
      'Lightweight, reliable apps for loyalty, operations and customer access.',
    details: [
      'iOS and Android from one codebase',
      'Loyalty and membership systems',
      'Push notifications and offline support',
    ],
  },
  {
    slug: 'ai-workflows',
    title: 'AI workflows',
    summary:
      'Practical AI that removes repetitive work and speeds up your team.',
    details: [
      'Document and content generation',
      'Smart assistants on your own data',
      'Human-in-the-loop review steps',
    ],
  },
  {
    slug: 'business-automation',
    title: 'Business automation',
    summary:
      'Connect the tools you already use and let the busywork run itself.',
    details: [
      'Lead capture to CRM pipelines',
      'Invoicing and reminders',
      'Scheduled syncs and integrations',
    ],
  },
  {
    slug: 'maintenance-growth',
    title: 'Maintenance & growth',
    summary:
      'Ongoing care, monitoring and iteration so your systems keep improving.',
    details: [
      'Updates, backups and security',
      'Analytics and conversion tuning',
      'Quarterly roadmap and reviews',
    ],
  },
]

export type Advantage = { title: string; body: string }

export const advantages: Advantage[] = [
  {
    title: 'Fast delivery',
    body: 'Tight scopes and a modern stack mean you launch in weeks, not quarters.',
  },
  {
    title: 'Real business understanding',
    body: 'We design around how your business actually makes money and runs day to day.',
  },
  {
    title: 'Modern stack',
    body: 'Current, well-supported tools that stay fast, secure and easy to extend.',
  },
  {
    title: 'CMS-first thinking',
    body: 'You own your content. Edit pages, products and offers without calling us.',
  },
  {
    title: 'AI-assisted build process',
    body: 'We use AI to move faster and cut cost — without cutting quality or care.',
  },
  {
    title: 'Long-term maintenance',
    body: 'Systems are looked after, monitored and improved long after launch.',
  },
  {
    title: 'Built under LMVK Group',
    body: 'The reliability and standards of an established group, in a focused studio.',
  },
]

export type Project = {
  slug: string
  name: string
  category: string
  description: string
  outcome: string
}

export const projects: Project[] = [
  {
    slug: 'golden-lama-coffee',
    name: 'Golden Lama Coffee',
    category: 'Website & CMS',
    description:
      'A premium brand site with an editable menu, story pages and a refined ordering experience.',
    outcome: 'Editorial brand presence with self-served content updates.',
  },
  {
    slug: 'monocool',
    name: 'MonoCool',
    category: 'Web platform',
    description:
      'A clean product platform with structured catalog content and a modern marketing front.',
    outcome: 'Faster launches of new product lines and campaigns.',
  },
  {
    slug: 'lmvk-group',
    name: 'LMVK Group',
    category: 'Corporate site',
    description:
      'A group company website presenting brands, services and the wider LMVK universe.',
    outcome: 'Unified, premium presentation of the group portfolio.',
  },
  {
    slug: 'vaelspin',
    name: 'Vaelspin',
    category: 'B2B portal',
    description:
      'A business portal with accounts, structured workflows and reporting for internal teams.',
    outcome: 'Manual processes moved into one connected system.',
  },
  {
    slug: 'loyalty-systems',
    name: 'App admin / loyalty systems',
    category: 'Mobile app & admin',
    description:
      'Loyalty and membership apps backed by an admin panel for offers and customer data.',
    outcome: 'Direct customer channel with measurable repeat engagement.',
  },
]

export type ProcessStep = {
  step: string
  title: string
  body: string
}

export const processSteps: ProcessStep[] = [
  {
    step: '01',
    title: 'Discover',
    body: 'We map your goals, customers and current systems to find the highest-impact work.',
  },
  {
    step: '02',
    title: 'Design',
    body: 'We shape the structure, content and interface around a clear, premium experience.',
  },
  {
    step: '03',
    title: 'Build',
    body: 'We develop with a modern, AI-assisted process and keep you in the loop throughout.',
  },
  {
    step: '04',
    title: 'Launch',
    body: 'We ship carefully, test the full flow and hand over a system your team can run.',
  },
  {
    step: '05',
    title: 'Maintain',
    body: 'We monitor, update and iterate so the system keeps performing and growing.',
  },
]

export type Package = {
  name: string
  fromPrice: string
  best: string
  features: string[]
  highlighted?: boolean
}

export const packages: Package[] = [
  {
    name: 'Starter Website + CMS',
    fromPrice: 'from request',
    best: 'For businesses replacing an outdated site.',
    features: [
      'Custom responsive website',
      'Editable CMS content',
      'SEO and performance setup',
      'Launch support',
    ],
  },
  {
    name: 'Business System / B2B Portal',
    fromPrice: 'from request',
    best: 'For teams moving manual work into a system.',
    features: [
      'Accounts and role-based access',
      'Custom workflows and dashboards',
      'Integrations with your tools',
      'Reporting and exports',
    ],
    highlighted: true,
  },
  {
    name: 'Mobile App / AI Workflow MVP',
    fromPrice: 'from request',
    best: 'For validating an app or AI idea fast.',
    features: [
      'Focused MVP scope',
      'Mobile app or AI workflow build',
      'Admin panel where needed',
      'Roadmap for next phase',
    ],
  },
]

export type AiTopic = { title: string; body: string }

export const aiTopics: AiTopic[] = [
  {
    title: 'ChatGPT & Claude',
    body: 'Use modern assistants confidently and safely for real daily work.',
  },
  {
    title: 'Canva & content',
    body: 'Produce on-brand visuals and content faster, without a design team.',
  },
  {
    title: 'AI content workflows',
    body: 'Repeatable processes for writing, summarising and research.',
  },
  {
    title: 'Practical automation',
    body: 'Hands-on training to remove repetitive tasks from your week.',
  },
]

export type Faq = { question: string; answer: string }

export const faqs: Faq[] = [
  {
    question: 'Who is Golden Digital Studio for?',
    answer:
      'Ambitious small businesses and founders in Czechia, Slovakia and Austria who want modern digital systems instead of outdated websites and manual work.',
  },
  {
    question: 'How fast can we launch?',
    answer:
      'Most starter websites launch in a few weeks. Larger portals and apps are scoped into focused phases so you see progress quickly.',
  },
  {
    question: 'Do we own our content and code?',
    answer:
      'Yes. We build CMS-first so your team can edit content, and you retain ownership of your systems.',
  },
  {
    question: 'How does pricing work?',
    answer:
      'We scope each project around your goals and share a clear proposal. Packages start from a base and are tailored to what you need.',
  },
  {
    question: 'What is the connection to LMVK Group?',
    answer:
      'Golden Digital Studio is a focused digital studio operating under LMVK Group, combining the standards of an established group with a specialised team.',
  },
]

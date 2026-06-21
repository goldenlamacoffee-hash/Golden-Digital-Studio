/**
 * Seeds CMS content for all three locales (en, cs-CZ, sk-SK).
 * Run with: node --env-file=/vercel/share/.env.project scripts/seed.mjs
 * Idempotent: uses ON CONFLICT (locale, slug/key) DO UPDATE.
 */
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const services = {
  en: [
    ['websites-cms', 'Websites & CMS', 'Fast, editorial websites with a content system your team can actually run.', ['Custom design aligned to your brand', 'Editable content without a developer', 'SEO-ready structure and performance']],
    ['b2b-portals', 'B2B portals', 'Client portals, dashboards and internal tools that replace spreadsheets.', ['Role-based access and accounts', 'Order, quote and document flows', 'Reporting and exports']],
    ['mobile-apps', 'Mobile apps', 'Lightweight, reliable apps for loyalty, operations and customer access.', ['iOS and Android from one codebase', 'Loyalty and membership systems', 'Push notifications and offline support']],
    ['ai-workflows', 'AI workflows', 'Practical AI that removes repetitive work and speeds up your team.', ['Document and content generation', 'Smart assistants on your own data', 'Human-in-the-loop review steps']],
    ['business-automation', 'Business automation', 'Connect the tools you already use and let the busywork run itself.', ['Lead capture to CRM pipelines', 'Invoicing and reminders', 'Scheduled syncs and integrations']],
    ['maintenance-growth', 'Maintenance & growth', 'Ongoing care, monitoring and iteration so your systems keep improving.', ['Updates, backups and security', 'Analytics and conversion tuning', 'Quarterly roadmap and reviews']],
  ],
  'cs-CZ': [
    ['websites-cms', 'Weby a CMS', 'Rychlé, redakční weby s redakčním systémem, který váš tým skutečně zvládne.', ['Návrh na míru podle vaší značky', 'Úpravy obsahu bez vývojáře', 'Struktura připravená pro SEO a výkon']],
    ['b2b-portals', 'B2B portály', 'Klientské portály, dashboardy a interní nástroje, které nahradí tabulky.', ['Přístupy a účty podle rolí', 'Toky objednávek, nabídek a dokumentů', 'Reporty a exporty']],
    ['mobile-apps', 'Mobilní aplikace', 'Lehké a spolehlivé aplikace pro věrnost, provoz a přístup zákazníků.', ['iOS i Android z jedné codebase', 'Věrnostní a členské systémy', 'Push notifikace a offline režim']],
    ['ai-workflows', 'AI workflow', 'Praktická AI, která odstraní opakovanou práci a zrychlí váš tým.', ['Generování dokumentů a obsahu', 'Chytří asistenti nad vašimi daty', 'Kontrolní kroky s člověkem']],
    ['business-automation', 'Automatizace procesů', 'Propojte nástroje, které už používáte, a nechte rutinu běžet samu.', ['Sběr leadů do CRM', 'Fakturace a připomínky', 'Plánované synchronizace a integrace']],
    ['maintenance-growth', 'Údržba a růst', 'Průběžná péče, monitoring a iterace, aby se systémy stále zlepšovaly.', ['Aktualizace, zálohy a bezpečnost', 'Analytika a ladění konverzí', 'Čtvrtletní roadmapa a revize']],
  ],
  'sk-SK': [
    ['websites-cms', 'Weby a CMS', 'Rýchle, redakčné weby s redakčným systémom, ktorý váš tím naozaj zvládne.', ['Návrh na mieru podľa vašej značky', 'Úpravy obsahu bez vývojára', 'Štruktúra pripravená pre SEO a výkon']],
    ['b2b-portals', 'B2B portály', 'Klientske portály, dashboardy a interné nástroje, ktoré nahradia tabuľky.', ['Prístupy a účty podľa rolí', 'Toky objednávok, ponúk a dokumentov', 'Reporty a exporty']],
    ['mobile-apps', 'Mobilné aplikácie', 'Ľahké a spoľahlivé aplikácie pre vernosť, prevádzku a prístup zákazníkov.', ['iOS aj Android z jednej codebase', 'Vernostné a členské systémy', 'Push notifikácie a offline režim']],
    ['ai-workflows', 'AI workflow', 'Praktická AI, ktorá odstráni opakovanú prácu a zrýchli váš tím.', ['Generovanie dokumentov a obsahu', 'Inteligentní asistenti nad vašimi dátami', 'Kontrolné kroky s človekom']],
    ['business-automation', 'Automatizácia procesov', 'Prepojte nástroje, ktoré už používate, a nechajte rutinu bežať samú.', ['Zber leadov do CRM', 'Fakturácia a pripomienky', 'Plánované synchronizácie a integrácie']],
    ['maintenance-growth', 'Údržba a rast', 'Priebežná starostlivosť, monitoring a iterácia, aby sa systémy stále zlepšovali.', ['Aktualizácie, zálohy a bezpečnosť', 'Analytika a ladenie konverzií', 'Štvrťročná roadmapa a revízie']],
  ],
}

const projects = {
  en: [
    ['golden-lama-coffee', 'Golden Lama Coffee', 'Website & CMS', 'A premium brand site with an editable menu, story pages and a refined ordering experience.'],
    ['monocool', 'MonoCool', 'Web platform', 'A clean product platform with structured catalog content and a modern marketing front.'],
    ['lmvk-group', 'LMVK Group', 'Corporate site', 'A group company website presenting brands, services and the wider LMVK universe.'],
    ['vaelspin', 'Vaelspin', 'B2B portal', 'A business portal with accounts, structured workflows and reporting for internal teams.'],
    ['loyalty-systems', 'App admin / loyalty systems', 'Mobile app & admin', 'Loyalty and membership apps backed by an admin panel for offers and customer data.'],
  ],
  'cs-CZ': [
    ['golden-lama-coffee', 'Golden Lama Coffee', 'Web a CMS', 'Prémiový web značky s editovatelným menu, příběhem a propracovaným objednáváním.'],
    ['monocool', 'MonoCool', 'Webová platforma', 'Čistá produktová platforma se strukturovaným katalogem a moderní marketingovou částí.'],
    ['lmvk-group', 'LMVK Group', 'Firemní web', 'Web skupiny prezentující značky, služby a širší svět LMVK.'],
    ['vaelspin', 'Vaelspin', 'B2B portál', 'Firemní portál s účty, strukturovanými workflow a reportingem pro interní týmy.'],
    ['loyalty-systems', 'App admin / věrnostní systémy', 'Mobilní aplikace a admin', 'Věrnostní a členské aplikace s admin panelem pro nabídky a data zákazníků.'],
  ],
  'sk-SK': [
    ['golden-lama-coffee', 'Golden Lama Coffee', 'Web a CMS', 'Prémiový web značky s editovateľným menu, príbehom a prepracovaným objednávaním.'],
    ['monocool', 'MonoCool', 'Webová platforma', 'Čistá produktová platforma so štruktúrovaným katalógom a modernou marketingovou časťou.'],
    ['lmvk-group', 'LMVK Group', 'Firemný web', 'Web skupiny prezentujúci značky, služby a širší svet LMVK.'],
    ['vaelspin', 'Vaelspin', 'B2B portál', 'Firemný portál s účtami, štruktúrovanými workflow a reportingom pre interné tímy.'],
    ['loyalty-systems', 'App admin / vernostné systémy', 'Mobilná aplikácia a admin', 'Vernostné a členské aplikácie s admin panelom pre ponuky a dáta zákazníkov.'],
  ],
}

const packages = {
  en: [
    ['starter-website', 'Starter Website + CMS', 'From request', 'For businesses replacing an outdated site.', ['Custom responsive website', 'Editable CMS content', 'SEO and performance setup', 'Launch support'], false],
    ['business-system', 'Business System / B2B Portal', 'From request', 'For teams moving manual work into a system.', ['Accounts and role-based access', 'Custom workflows and dashboards', 'Integrations with your tools', 'Reporting and exports'], true],
    ['mvp', 'Mobile App / AI Workflow MVP', 'From request', 'For validating an app or AI idea fast.', ['Focused MVP scope', 'Mobile app or AI workflow build', 'Admin panel where needed', 'Roadmap for next phase'], false],
  ],
  'cs-CZ': [
    ['starter-website', 'Startovní web + CMS', 'Na vyžádání', 'Pro firmy, které nahrazují zastaralý web.', ['Web na míru, responzivní', 'Editovatelný obsah v CMS', 'Nastavení SEO a výkonu', 'Podpora při spuštění'], false],
    ['business-system', 'Firemní systém / B2B portál', 'Na vyžádání', 'Pro týmy, které přesouvají ruční práci do systému.', ['Účty a přístup podle rolí', 'Workflow a dashboardy na míru', 'Integrace s vašimi nástroji', 'Reporty a exporty'], true],
    ['mvp', 'Mobilní aplikace / AI workflow MVP', 'Na vyžádání', 'Pro rychlé ověření aplikace nebo AI nápadu.', ['Cílený rozsah MVP', 'Mobilní aplikace nebo AI workflow', 'Admin panel dle potřeby', 'Roadmapa pro další fázi'], false],
  ],
  'sk-SK': [
    ['starter-website', 'Štartovací web + CMS', 'Na vyžiadanie', 'Pre firmy, ktoré nahrádzajú zastaraný web.', ['Web na mieru, responzívny', 'Editovateľný obsah v CMS', 'Nastavenie SEO a výkonu', 'Podpora pri spustení'], false],
    ['business-system', 'Firemný systém / B2B portál', 'Na vyžiadanie', 'Pre tímy, ktoré presúvajú ručnú prácu do systému.', ['Účty a prístup podľa rolí', 'Workflow a dashboardy na mieru', 'Integrácie s vašimi nástrojmi', 'Reporty a exporty'], true],
    ['mvp', 'Mobilná aplikácia / AI workflow MVP', 'Na vyžiadanie', 'Pre rýchle overenie aplikácie alebo AI nápadu.', ['Cielený rozsah MVP', 'Mobilná aplikácia alebo AI workflow', 'Admin panel podľa potreby', 'Roadmapa pre ďalšiu fázu'], false],
  ],
}

const settings = {
  en: ['Golden Digital Studio', 'Digital systems. AI workflows. Impact.', 'LMVK Group', 'hello@goldendigitalstudio.example', ['Czech Republic', 'Slovakia', 'Austria'], 'Golden Digital Studio — Digital systems. AI workflows. Impact.', 'Websites, apps and AI systems for ambitious small businesses.'],
  'cs-CZ': ['Golden Digital Studio', 'Digitální systémy. AI workflow. Dopad.', 'LMVK Group', 'hello@goldendigitalstudio.example', ['Česká republika', 'Slovensko', 'Rakousko'], 'Golden Digital Studio — Digitální systémy. AI workflow. Dopad.', 'Weby, aplikace a AI systémy pro ambiciózní malé firmy.'],
  'sk-SK': ['Golden Digital Studio', 'Digitálne systémy. AI workflow. Dopad.', 'LMVK Group', 'hello@goldendigitalstudio.example', ['Česká republika', 'Slovensko', 'Rakúsko'], 'Golden Digital Studio — Digitálne systémy. AI workflow. Dopad.', 'Weby, aplikácie a AI systémy pre ambiciózne malé firmy.'],
}

async function run() {
  const locales = ['en', 'cs-CZ', 'sk-SK']
  for (const locale of locales) {
    for (let i = 0; i < services[locale].length; i++) {
      const [slug, title, summary, features] = services[locale][i]
      await pool.query(
        `INSERT INTO services (locale, slug, title, summary, features, sort_order, is_published)
         VALUES ($1,$2,$3,$4,$5,$6,true)
         ON CONFLICT (locale, slug) DO UPDATE SET title=$3, summary=$4, features=$5, sort_order=$6`,
        [locale, slug, title, summary, JSON.stringify(features), i],
      )
    }
    for (let i = 0; i < projects[locale].length; i++) {
      const [slug, name, category, description] = projects[locale][i]
      await pool.query(
        `INSERT INTO projects (locale, slug, name, category, description, sort_order, is_published)
         VALUES ($1,$2,$3,$4,$5,$6,true)
         ON CONFLICT (locale, slug) DO UPDATE SET name=$3, category=$4, description=$5, sort_order=$6`,
        [locale, slug, name, category, description, i],
      )
    }
    for (let i = 0; i < packages[locale].length; i++) {
      const [slug, name, price, description, features, featured] = packages[locale][i]
      await pool.query(
        `INSERT INTO packages (locale, slug, name, price, description, features, is_featured, cta_label, sort_order, is_published)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,true)
         ON CONFLICT (locale, slug) DO UPDATE SET name=$3, price=$4, description=$5, features=$6, is_featured=$7, cta_label=$8, sort_order=$9`,
        [locale, slug, name, price, description, JSON.stringify(features), featured, 'Start a project', i],
      )
    }
    const s = settings[locale]
    await pool.query(
      `INSERT INTO site_settings (locale, brand_name, tagline, parent, email, regions, seo_title, seo_description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (locale) DO UPDATE SET brand_name=$2, tagline=$3, parent=$4, email=$5, regions=$6, seo_title=$7, seo_description=$8`,
      [locale, s[0], s[1], s[2], s[3], JSON.stringify(s[4]), s[5], s[6]],
    )
    console.log(`Seeded locale: ${locale}`)
  }
  await pool.end()
  console.log('Seed complete.')
}

run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})

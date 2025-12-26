import type { Locale } from "@/lib/i18n";

export const PAGES = {
  sk: {
    about: {
      title: "O projekte",
      subtitle: "Čo je Shelfie a prečo vznikla",
      body: [
        "Shelfie je experimentálna webová aplikácia vydavateľstva Albatros Media, ktorá pomocou fotografie vašej knižnice odhadne čitateľské preferencie a priradí orientačný čitateľský archetyp („knižný typ“) spolu s jednoduchým hodnotením book vibe.",
        "Cieľom projektu je priniesť hravý a nenásilný spôsob objavovania kníh a tém, ktoré by vám mohli sedieť — nie hodnotiť vás alebo vaše čitateľské návyky.",
        "Aplikácia pracuje s vizuálnymi signálmi zachytenými na fotografii (napr. chrbty kníh, typ knižnice, žánrové vzory). Ak sú knihy nečitateľné alebo je fotografia nekvalitná, presnosť výsledku môže klesnúť.",
      ],
    },

    privacy: {
      title: "Súkromie",
      subtitle: "Ako pracujeme s vašimi údajmi",
      body: [
        "Fotografie používame výhradne na jednorazovú analýzu obsahu knižnice a určenie výsledku (knižný typ a book vibe). Po zobrazení výsledku sa fotografia ďalej nespracúva.",
        "Fotografie nepredávame ani neposkytujeme tretím stranám na marketingové alebo analytické účely.",
        "Odporúčame fotiť tak, aby na zábere boli najmä knihy. Ak sa na fotografii nachádzajú osobné údaje, tváre alebo dokumenty, môžu byť súčasťou odoslaného obrázka — preto fotografiu pred odoslaním skontrolujte.",
        "Aplikácia môže používať nevyhnutné technické úložiská v prehliadači (napr. dočasné uloženie fotografie pre náhľad alebo export zdieľateľného obrázka).",
      ],
    },

    terms: {
      title: "Podmienky používania",
      subtitle: "Základné pravidlá používania aplikácie",
      body: [
        "Používaním aplikácie Shelfie beriete na vedomie, že výsledky majú výhradne informatívny a odporúčací charakter.",
        "Aplikácia neslúži ako odborné poradenstvo ani ako náhrada profesionálnych služieb.",
        "Shelfie je experimentálny produkt a môže sa meniť, dočasne nefungovať alebo zobrazovať nepresné výstupy.",
        "Prevádzkovateľ si vyhradzuje právo aplikáciu kedykoľvek upraviť alebo ukončiť.",
      ],
    },
  },

  cz: {
    about: {
      title: "O projektu",
      subtitle: "Co je Shelfie a proč vznikla",
      body: [
        "Shelfie je experimentální webová aplikace vydavatelství Albatros Media, která pomocí fotografie vaší knihovny odhaduje čtenářské preference a přiřazuje orientační čtenářský archetyp spolu s jednoduchým hodnocením book vibe.",
        "Cílem projektu je nabídnout hravý a nenásilný způsob objevování knih a témat, která by vám mohla sedět — nikoli vás hodnotit.",
        "Aplikace pracuje s vizuálními signály zachycenými na fotografii. Pokud jsou knihy nečitelné nebo je fotografie nekvalitní, přesnost výsledku může klesnout.",
      ],
    },

    privacy: {
      title: "Soukromí",
      subtitle: "Jak pracujeme s vašimi údaji",
      body: [
        "Fotografie používáme výhradně k jednorázové analýze obsahu knihovny a zobrazení výsledku.",
        "Fotografie neprodáváme ani neposkytujeme třetím stranám.",
        "Doporučujeme fotografovat především knihy. Pokud se na snímku nacházejí osobní údaje nebo tváře, mohou být součástí odeslaného obrázku.",
        "Aplikace může používat nezbytná technická úložiště v prohlížeči.",
      ],
    },

    terms: {
      title: "Podmínky používání",
      subtitle: "Základní pravidla používání aplikace",
      body: [
        "Používáním aplikace Shelfie berete na vědomí, že výsledky mají pouze informativní charakter.",
        "Aplikace neslouží jako odborné poradenství.",
        "Shelfie je experimentální produkt a jeho chování se může měnit.",
        "Provozovatel si vyhrazuje právo aplikaci kdykoli upravit nebo ukončit.",
      ],
    },
  },

  en: {
    about: {
      title: "About",
      subtitle: "What Shelfie is and why it exists",
      body: [
        "Shelfie is an experimental web application by Albatros Media that analyzes a photo of your bookshelf to estimate reading preferences and assign an indicative reading archetype along with a simple book vibe score.",
        "The goal of the project is to offer a playful, non-judgmental way to discover books and themes that might suit you.",
        "The app relies on visual signals visible in the photo. If book spines are unreadable or the photo quality is poor, accuracy may decrease.",
      ],
    },

    privacy: {
      title: "Privacy",
      subtitle: "How we handle your data",
      body: [
        "Photos are used solely for a one-time analysis to generate your result.",
        "We do not sell or share photos with third parties.",
        "We recommend photographing only books. If personal data or faces appear in the image, they may be included in the upload.",
        "The app may use essential browser storage for preview and export purposes.",
      ],
    },

    terms: {
      title: "Terms of Use",
      subtitle: "Basic rules for using the app",
      body: [
        "By using Shelfie, you acknowledge that results are purely informational.",
        "The app does not provide professional advice.",
        "Shelfie is an experimental product and may change or be unavailable.",
        "The operator reserves the right to modify or discontinue the app at any time.",
      ],
    },
  },
} satisfies Record<
  Locale,
  {
    about: { title: string; subtitle: string; body: string[] };
    privacy: { title: string; subtitle: string; body: string[] };
    terms: { title: string; subtitle: string; body: string[] };
  }
>;

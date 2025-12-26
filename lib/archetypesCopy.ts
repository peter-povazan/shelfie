// lib/archetypesCopy.ts
import type { Locale } from "@/lib/i18n";
import { ARCHETYPES, type ArchetypeKey, type ArchetypeMeta } from "@/lib/archetypes";

export type ArchetypeCopy = Pick<ArchetypeMeta, "title" | "motif" | "insight" | "description" | "theme">;

type CopyByLocale = Record<Locale, Record<ArchetypeKey, ArchetypeCopy>>;

/**
 * SK berieme 1:1 z ARCHETYPES (tvoje pôvodné texty).
 * CZ a EN pridávame ako preklady – theme preberáme vždy zo SK (aby obrázky/farby ostali rovnaké).
 */
const sk = ARCHETYPES;

const cz: Record<ArchetypeKey, Omit<ArchetypeCopy, "theme">> = {
  Bezkniznik: {
    title: "Prázdná knihovna",
    motif: "Žádné knihy na dohled",
    insight: "Tvé příběhy na tebe zatím čekají.",
    description:
      "Na fotce nevidím knihy nebo čitelné hřbety. Zkus vyfotit polici s knihami a lepším světlem.",
  },
  Manga: {
    title: "Manga",
    motif: "Série a vizuální příběhy",
    insight: "Příběh v obrazech je tvůj jazyk — série a postavy jsou návykové.",
    description:
      "Příběh v obrazech je tvůj jazyk. Miluješ série, postavy a světy, které rostou díl po dílu.",
  },
  Gamer: {
    title: "Čtenář herních světů",
    motif: "Lore a herní univerza",
    insight: "Herní příběh a lore tě baví stejně jako samotné hraní.",
    description:
      "Herní světy, lore a univerza tě baví stejně jako hraní. Jsi doma v RPG, mapách a příbězích z her.",
  },
  Fantasta: {
    title: "Fantasta",
    motif: "Fantazie a magie",
    insight: "Únik do jiných světů je tvůj druhý domov.",
    description:
      "Únik do jiných světů je tvůj druhý domov. Fantazie, magie a představivost jsou tvoje síla.",
  },
  Scifi: {
    title: "Vizionářský čtenář",
    motif: "Budoucnost a technologie",
    insight: "Přemýšlíš dopředu — fascinuje tě, kam směřujeme.",
    description:
      "Přemýšlíš dopředu. Fascinuje tě budoucnost, technologie a otázky, kam směřujeme.",
  },
  Detektiv: {
    title: "Detektiv",
    motif: "Záhady a zvraty",
    insight: "Baví tě hledat pravdu mezi řádky.",
    description: "Baví tě hledat pravdu mezi řádky. Napětí, záhady a zvraty jsou tvůj svět.",
  },
  Horor: {
    title: "Temný čtenář",
    motif: "Tma a mrazení",
    insight: "Mrazení v zádech je tvůj guilty pleasure — čteš i potmě.",
    description:
      "Baví tě mrazení v zádech, temná atmosféra a napětí, které se nedá odložit. Čteš i potmě.",
  },
  Akcny: {
    title: "Čtenář v tempu",
    motif: "Akce a adrenalin",
    insight: "Když tě kniha chytí, jedeš bez pauzy až do konce.",
    description:
      "Máš rád tempo, napětí a silný děj. Když tě kniha chytí, jedeš bez pauzy až do konce.",
  },
  Romantik: {
    title: "Romantik",
    motif: "Emoce a vztahy",
    insight: "Čtení je pro tebe zážitek srdcem — hledáš emoce a blízkost.",
    description:
      "Hledáš emoce, vztahy a silné lidské příběhy. Čtení je pro tebe zážitek srdcem.",
  },
  Poetik: {
    title: "Poetik",
    motif: "Jazyk a atmosféra",
    insight: "Čteš pro krásu slov a ticho mezi nimi.",
    description:
      "Záleží ti na jazyce, atmosféře a emoci. Čteš pro krásu slov a ticho mezi nimi.",
  },
  Motivator: {
    title: "Motivátor",
    motif: "Růst a návyky",
    insight: "Knihy bereš jako impulz — chceš se posouvat a růst.",
    description:
      "Knihy bereš jako impulz k lepšímu životu. Rád na sobě pracuješ a posouváš se dál.",
  },
  Biznis: {
    title: "Strategický čtenář",
    motif: "Strategie a rozhodování",
    insight: "Čteš strategicky — baví tě úspěch, systém a rozhodování.",
    description:
      "Čteš strategicky. Zajímá tě úspěch, rozhodování a fungování světa kolem nás.",
  },
  Intelektual: {
    title: "Hloubavý čtenář",
    motif: "Poznání a souvislosti",
    insight: "Čteš, abys viděl souvislosti — jdeš do hloubky.",
    description:
      "Baví tě chápat svět do hloubky. Non-fiction, věda, historie či filozofie – čteš, abys viděl souvislosti.",
  },
  Rodic: {
    title: "Rodič a dítě",
    motif: "Děti a společný čas",
    insight: "Knihy jsou tu pro společné čtení — sdílené příběhy, které spojují děti i dospělé.",
    description:
      "Knihy jsou tu pro společné čtení — sdílené příběhy, které spojují děti i dospělé.",
  },
  Cestovatel: {
    title: "Cestovatel",
    motif: "Svět a kultury",
    insight: "Každá kniha je pro tebe cesta — místa, lidé, kultury.",
    description:
      "Každá kniha je pro tebe cesta. Zajímají tě místa, kultury a skutečné příběhy světa.",
  },
  Dobrodruh: {
    title: "Dobrodruh",
    motif: "Pohyb a objevování",
    insight: "Láká tě neznámo — knihy jsou výprava za hranice jistoty.",
    description:
      "Láká tě pohyb, objevování a neznámo. Knihy jsou pro tebe výpravou za hranice jistoty.",
  },
  Labuznik: {
    title: "Labužník",
    motif: "Vychutnávání a pohoda",
    insight: "Čteš pomalu a s chutí — příběh si vychutnáváš.",
    description:
      "Čteš pomalu a s chutí. Každý příběh si vychutnáváš jako dobré jídlo.",
  },
  Vsehochut: {
    title: "Všehochuť",
    motif: "Pestrost a zvědavost",
    insight: "Nevážeš se na jeden žánr — baví tě pestrost a mix.",
    description:
      "Máš chuť na všechno – od příběhů po fakta. Nevážeš se na jeden žánr, baví tě pestrost.",
  },
};

const en: Record<ArchetypeKey, Omit<ArchetypeCopy, "theme">> = {
  Bezkniznik: {
    title: "Empty bookshelf",
    motif: "No books in sight",
    insight: "Your stories are still waiting for you.",
    description:
      "I can’t see books or readable spines in the photo. Try taking a clearer shot of your bookshelf with better light.",
  },
  Manga: {
    title: "Manga",
    motif: "Series and visual storytelling",
    insight: "Stories in images are your language — series and characters hook you fast.",
    description:
      "Stories in images are your language. You love series, characters, and worlds that grow chapter by chapter.",
  },
  Gamer: {
    title: "Reader of game worlds",
    motif: "Lore and game universes",
    insight: "Game stories and lore entertain you as much as the gameplay itself.",
    description:
      "Game worlds, lore and universes pull you in as much as playing. You feel at home in RPGs, maps and game narratives.",
  },
  Fantasta: {
    title: "Fantasy reader",
    motif: "Fantasy and magic",
    insight: "Escaping to other worlds is your second home.",
    description:
      "Escaping to other worlds is your second home. Fantasy, magic and imagination are your strengths.",
  },
  Scifi: {
    title: "Visionary reader",
    motif: "Future and technology",
    insight: "You think ahead — you’re fascinated by where we’re heading.",
    description:
      "You think ahead. The future, technology and the question of where we’re heading fascinate you.",
  },
  Detektiv: {
    title: "Detective",
    motif: "Mysteries and twists",
    insight: "You enjoy finding the truth between the lines.",
    description: "You enjoy finding the truth between the lines. Suspense, mysteries and twists are your world.",
  },
  Horor: {
    title: "Dark reader",
    motif: "Darkness and chills",
    insight: "That spine-tingling feeling is your guilty pleasure — you read even in the dark.",
    description:
      "You love the chills, dark atmosphere and page-turning tension. You read even when the lights are off.",
  },
  Akcny: {
    title: "Fast-paced reader",
    motif: "Action and adrenaline",
    insight: "When a book grabs you, you go nonstop to the very end.",
    description:
      "You like pace, suspense and a strong plot. Once it grabs you, you go nonstop to the very end.",
  },
  Romantik: {
    title: "Romantic",
    motif: "Emotions and relationships",
    insight: "Reading is a heart experience — you look for emotion and closeness.",
    description:
      "You seek emotions, relationships and strong human stories. Reading is a heart experience for you.",
  },
  Poetik: {
    title: "Poetic reader",
    motif: "Language and atmosphere",
    insight: "You read for the beauty of words — and the silence between them.",
    description:
      "You care about language, atmosphere and emotion. You read for the beauty of words and the quiet between them.",
  },
  Motivator: {
    title: "Motivator",
    motif: "Growth and habits",
    insight: "Books are your spark — you want to move forward and grow.",
    description:
      "Books are your spark for a better life. You like working on yourself and moving forward.",
  },
  Biznis: {
    title: "Strategic reader",
    motif: "Strategy and decisions",
    insight: "You read strategically — success, systems and decision-making interest you.",
    description:
      "You read strategically. You’re interested in success, decision-making and how the world works.",
  },
  Intelektual: {
    title: "Deep thinker",
    motif: "Knowledge and connections",
    insight: "You read to connect the dots — you go deep.",
    description:
      "You enjoy understanding the world in depth. Non-fiction, science, history or philosophy — you read to see connections.",
  },
  Rodic: {
    title: "Parent & child",
    motif: "Kids and shared time",
    insight: "Books are for reading together — shared stories that connect kids and adults.",
    description:
      "Books are for reading together — shared stories that connect kids and adults.",
  },
  Cestovatel: {
    title: "Traveler",
    motif: "World and cultures",
    insight: "Every book is a journey — places, people, cultures.",
    description:
      "Every book is a journey for you. You’re drawn to places, cultures and real stories of the world.",
  },
  Dobrodruh: {
    title: "Adventurer",
    motif: "Movement and discovery",
    insight: "The unknown calls you — books are an expedition beyond comfort.",
    description:
      "You’re drawn to movement, discovery and the unknown. Books are your expedition beyond comfort.",
  },
  Labuznik: {
    title: "Savorer",
    motif: "Savoring and comfort",
    insight: "You read slowly and with taste — you savor the story.",
    description:
      "You read slowly and with taste. You savor every story like a great meal.",
  },
  Vsehochut: {
    title: "Omnivore reader",
    motif: "Variety and curiosity",
    insight: "You don’t stick to one genre — you love variety and mixing it up.",
    description:
      "You’re up for anything — from stories to facts. You don’t stick to one genre; variety is your thing.",
  },
};

function withTheme(
  base: Record<ArchetypeKey, ArchetypeMeta>,
  tr: Record<ArchetypeKey, Omit<ArchetypeCopy, "theme">>
): Record<ArchetypeKey, ArchetypeCopy> {
  const out = {} as Record<ArchetypeKey, ArchetypeCopy>;
  (Object.keys(base) as ArchetypeKey[]).forEach((k) => {
    out[k] = { ...tr[k], theme: base[k].theme };
  });
  return out;
}

export const ARCHETYPE_COPY: CopyByLocale = {
  sk: (Object.keys(sk) as ArchetypeKey[]).reduce((acc, k) => {
    acc[k] = {
      title: sk[k].title,
      motif: sk[k].motif,
      insight: sk[k].insight,
      description: sk[k].description,
      theme: sk[k].theme,
    };
    return acc;
  }, {} as Record<ArchetypeKey, ArchetypeCopy>),

  cz: withTheme(sk, cz),
  en: withTheme(sk, en),
};

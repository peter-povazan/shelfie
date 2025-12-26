import type { ArchetypeKey } from "@/lib/archetypes";

export const ARCHETYPES_I18N = {
  cz: {
    Bezkniznik: {
      title: "Prázdná knihovna",
      motif: "Žádné knihy na dohled",
      insight: "Tvé příběhy na tebe zatím čekají.",
      description:
        "Na fotografii nejsou viditelné knihy nebo čitelné hřbety. Zkus vyfotit knihovnu zblízka a s lepším světlem.",
    },

    Manga: {
      title: "Manga",
      motif: "Série a vizuální příběhy",
      insight: "Příběh v obrazech je tvůj jazyk — série a postavy jsou návykové.",
      description:
        "Příběh v obrazech je tvůj jazyk. Miluješ série, postavy a světy, které rostou díl po díle.",
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
        "Únik do jiných světů je tvůj druhý domov. Fantazie, magie a představivost jsou tvou silou.",
    },

    Scifi: {
      title: "Vizionářský čtenář",
      motif: "Budoucnost a technologie",
      insight: "Přemýšlíš dopředu — fascinuje tě, kam směřujeme.",
      description:
        "Přemýšlíš dopředu. Fascinuje tě budoucnost, technologie a otázky, kam svět směřuje.",
    },

    Detektiv: {
      title: "Detektiv",
      motif: "Záhady a zvraty",
      insight: "Baví tě hledat pravdu mezi řádky.",
      description:
        "Baví tě hledat pravdu mezi řádky. Napětí, záhady a nečekané zvraty jsou tvůj svět.",
    },

    Horor: {
      title: "Temný čtenář",
      motif: "Temno a mrazení",
      insight: "Mrazení v zádech je tvůj guilty pleasure — čteš i potmě.",
      description:
        "Baví tě mrazení v zádech, temná atmosféra a napětí, které se nedá odložit. Čteš i potmě.",
    },

    Akcny: {
      title: "Čtenář v tempu",
      motif: "Akce a adrenalin",
      insight: "Když kniha chytne, jedeš bez přestávky až do konce.",
      description:
        "Máš rád tempo, napětí a silný děj. Když kniha chytne, jedeš bez přestávky až do konce.",
    },

    Romantik: {
      title: "Romantik",
      motif: "Emoce a vztahy",
      insight: "Čtení je pro tebe zážitek srdce — hledáš emoce a blízkost.",
      description:
        "Hledáš emoce, vztahy a silné lidské příběhy. Čtení je pro tebe zážitkem srdce.",
    },

    Poetik: {
      title: "Poetik",
      motif: "Jazyk a atmosféra",
      insight: "Čteš pro krásu slov a ticho mezi nimi.",
      description:
        "Záleží ti na jazyku, atmosféře a emocích. Čteš pro krásu slov a ticha mezi nimi.",
    },

    Motivator: {
      title: "Motivátor",
      motif: "Růst a návyky",
      insight: "Knihy bereš jako impuls — chceš se posouvat a růst.",
      description:
        "Knihy bereš jako impuls k lepšímu životu. Rád na sobě pracuješ a posouváš se dál.",
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
        "Baví tě chápat svět do hloubky. Non-fiction, věda, historie či filozofie — čteš, abys viděl souvislosti.",
    },

    Rodic: {
      title: "Rodič a dítě",
      motif: "Děti a společný čas",
      insight: "Knihy jsou tu pro společné čtení — sdílené příběhy.",
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
      insight: "Láká tě neznámo — knihy jsou výpravou za hranice jistoty.",
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
        "Máš chuť na všechno — od příběhů po fakta. Nevážeš se na jeden žánr, baví tě pestrost.",
    },
  },

  en: {
    Bezkniznik: {
      title: "Empty Bookshelf",
      motif: "No books in sight",
      insight: "Your stories are still waiting for you.",
      description:
        "No readable books were detected. Try taking a closer photo of your bookshelf with better lighting.",
    },

    Manga: {
      title: "Manga",
      motif: "Series and visual stories",
      insight: "Stories told through images are your language — series and characters hook you.",
      description:
        "Visual storytelling is your language. You love series, characters, and worlds that grow volume by volume.",
    },

    Gamer: {
      title: "Gaming Reader",
      motif: "Lore and game universes",
      insight: "Game stories and lore fascinate you as much as playing itself.",
      description:
        "Game worlds, lore, and universes excite you just as much as gameplay. You feel at home in RPGs and story-driven games.",
    },

    Fantasta: {
      title: "Fantasy Reader",
      motif: "Fantasy and magic",
      insight: "Escaping into other worlds feels like home.",
      description:
        "Escaping into other worlds is your comfort zone. Fantasy, magic, and imagination fuel your reading.",
    },

    Scifi: {
      title: "Visionary Reader",
      motif: "Future and technology",
      insight: "You think ahead — fascinated by where we are heading.",
      description:
        "You are drawn to the future, technology, and questions about where humanity is going.",
    },

    Detektiv: {
      title: "Detective",
      motif: "Mysteries and twists",
      insight: "You enjoy searching for truth between the lines.",
      description:
        "You love tension, clues, and unexpected twists. Piecing the story together is part of the thrill.",
    },

    Horor: {
      title: "Dark Reader",
      motif: "Darkness and chills",
      insight: "That chill down your spine is your guilty pleasure — even at night.",
      description:
        "You seek dark atmospheres and intense emotions. Tension is part of the experience.",
    },

    Akcny: {
      title: "Fast-Paced Reader",
      motif: "Action and adrenaline",
      insight: "When a story grabs you, you read straight through to the end.",
      description:
        "You enjoy pace, tension, and strong plots. Reading should have momentum.",
    },

    Romantik: {
      title: "Romantic",
      motif: "Emotions and relationships",
      insight: "Reading is a matter of the heart — you seek emotion and closeness.",
      description:
        "You look for emotional depth, relationships, and human stories that resonate.",
    },

    Poetik: {
      title: "Poetic Reader",
      motif: "Language and atmosphere",
      insight: "You read for the beauty of words and the silence between them.",
      description:
        "Language, mood, and subtle meaning matter to you as much as the story itself.",
    },

    Motivator: {
      title: "Motivator",
      motif: "Growth and habits",
      insight: "Books are impulses — tools for personal growth.",
      description:
        "You read to improve and move forward. Ideas that can be applied to life inspire you.",
    },

    Biznis: {
      title: "Strategic Reader",
      motif: "Strategy and decision-making",
      insight: "You read strategically — systems and success interest you.",
      description:
        "You are interested in how the world works, decisions, and strategic thinking.",
    },

    Intelektual: {
      title: "Deep Thinker",
      motif: "Knowledge and connections",
      insight: "You read to understand deeper connections.",
      description:
        "You enjoy depth. Science, philosophy, and history help you see the bigger picture.",
    },

    Rodic: {
      title: "Parent and Child",
      motif: "Shared reading",
      insight: "Books create shared moments across generations.",
      description:
        "Reading is a shared experience. Stories connect children and adults alike.",
    },

    Cestovatel: {
      title: "Traveler",
      motif: "World and cultures",
      insight: "Every book is a journey.",
      description:
        "You are drawn to places, cultures, and real stories from around the world.",
    },

    Dobrodruh: {
      title: "Adventurer",
      motif: "Movement and discovery",
      insight: "The unknown draws you in.",
      description:
        "Stories are expeditions. Discovery and movement are part of your reading.",
    },

    Labuznik: {
      title: "Slow Reader",
      motif: "Enjoyment and comfort",
      insight: "You read slowly, savoring every story.",
      description:
        "You take your time and enjoy details. Reading is about pleasure, not speed.",
    },

    Vsehochut: {
      title: "Eclectic Reader",
      motif: "Variety and curiosity",
      insight: "You are not tied to one genre — you enjoy the mix.",
      description:
        "You read according to mood, enjoying both stories and facts across genres.",
    },
  },
} satisfies Record<
  "cz" | "en",
  Record<
    ArchetypeKey,
    {
      title: string;
      motif: string;
      insight: string;
      description: string;
    }
  >
>;

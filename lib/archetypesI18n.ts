// lib/archetypesI18n.ts
import type { Locale } from "@/lib/i18n";
import { ARCHETYPES, type ArchetypeKey } from "@/lib/archetypes";

type LocalizedArchetypeText = {
  title: string;
  motif: string;
  insight: string;
  description: string;
};

const TEXT: Record<Locale, Record<ArchetypeKey, LocalizedArchetypeText>> = {
  sk: {
    Bezkniznik: {
      title: "Prázdna knižnica",
      motif: "Žiadne knihy na dohľad",
      insight: "Tvoje príbehy na teba zatiaľ čakajú.",
      description:
        "Na fotke nevidím knihy alebo čitateľné chrbty. Skús odfotiť poličku s knihami a lepším svetlom.",
    },
    Manga: {
      title: "Manga",
      motif: "Série a vizuálne príbehy",
      insight: "Príbeh v obrazoch je tvoj jazyk — série a postavy sú návykové.",
      description:
        "Príbeh v obrazoch je tvoj jazyk. Miluješ série, postavy a svety, ktoré rastú diel po diele.",
    },
    Fantasta: {
      title: "Fantasta",
      motif: "Fantázia a mágia",
      insight: "Únik do iných svetov je tvoj druhý domov.",
      description:
        "Únik do iných svetov je tvoj druhý domov. Fantázia, mágia a predstavivosť sú tvoja sila.",
    },
    Scifi: {
      title: "Vizionársky čitateľ",
      motif: "Budúcnosť a technológie",
      insight: "Premýšľaš dopredu — fascinuje ťa, kam smerujeme.",
      description:
        "Premýšľaš dopredu. Fascinuje ťa budúcnosť, technológie a otázky, kam smerujeme.",
    },
    Detektiv: {
      title: "Detektív",
      motif: "Záhady a zvraty",
      insight: "Baví ťa hľadať pravdu medzi riadkami.",
      description: "Baví ťa hľadať pravdu medzi riadkami. Napätie, záhady a zvraty sú tvoj svet.",
    },
    Horor: {
      title: "Temný čitateľ",
      motif: "Temno a mrazenie",
      insight: "Mrazenie v chrbte je tvoj guilty pleasure — čítaš aj po tme.",
      description:
        "Baví ťa mrazenie v chrbte, temná atmosféra a napätie, ktoré sa nedá odložiť. Čítaš aj po tme.",
    },
    Romantik: {
      title: "Romantik",
      motif: "Emócie a vzťahy",
      insight: "Čítanie je pre teba zážitok srdca — hľadáš emócie a blízkosť.",
      description:
        "Hľadáš emócie, vzťahy a silné ľudské príbehy. Čítanie je pre teba zážitok srdca.",
    },
    Poetik: {
      title: "Poetik",
      motif: "Jazyk a atmosféra",
      insight: "Čítaš pre krásu slov a ticho medzi nimi.",
      description: "Záleží ti na jazyku, atmosfére a emócii. Čítaš pre krásu slov a ticha medzi nimi.",
    },
    Akcny: {
      title: "Čitateľ v tempe",
      motif: "Akcia a adrenalín",
      insight: "Keď kniha chytí, ideš bez prestávky až do konca.",
      description:
        "Máš rád tempo, napätie a silný dej. Keď kniha chytí, ideš bez prestávky až do konca.",
    },
    Motivator: {
      title: "Motivátor",
      motif: "Rast a návyky",
      insight: "Knihy berieš ako impulz — chceš sa posúvať a rásť.",
      description:
        "Knihy berieš ako impulz k lepšiemu životu. Rád na sebe pracuješ a posúvaš sa ďalej.",
    },
    Biznis: {
      title: "Strategický čitateľ",
      motif: "Stratégia a rozhodovanie",
      insight: "Čítaš strategicky — baví ťa úspech, systém a rozhodovanie.",
      description: "Čítaš strategicky. Zaujíma ťa úspech, rozhodovanie a fungovanie sveta okolo nás.",
    },
    Intelektual: {
      title: "Hĺbavý čitateľ",
      motif: "Poznanie a súvislosti",
      insight: "Čítaš, aby si videl súvislosti — ideš do hĺbky.",
      description:
        "Baví ťa chápať svet do hĺbky. Non-fiction, veda, história či filozofia – čítaš, aby si videl súvislosti.",
    },
    Rodic: {
      title: "Rodič a dieťa",
      motif: "Deti a spoločný čas",
      insight: "Knihy sú tu pre spoločné čítanie — zdieľané príbehy, ktoré spájajú deti aj dospelých.",
      description:
        "Knihy sú tu pre spoločné čítanie — zdieľané príbehy, ktoré spájajú deti aj dospelých.",
    },
    Cestovatel: {
      title: "Cestovateľ",
      motif: "Svet a kultúry",
      insight: "Každá kniha je pre teba cesta — miesta, ľudia, kultúry.",
      description: "Každá kniha je pre teba cesta. Zaujíma ťa miesta, kultúry a skutočné príbehy sveta.",
    },
    Dobrodruh: {
      title: "Dobrodruh",
      motif: "Pohyb a objavovanie",
      insight: "Láka ťa neznámo — knihy sú výprava za hranice istoty.",
      description: "Láka ťa pohyb, objavovanie a neznámo. Knihy sú pre teba výpravou za hranice istoty.",
    },
    Labuznik: {
      title: "Labužník",
      motif: "Vychutnávanie a pohoda",
      insight: "Čítaš pomaly a s chuťou — príbeh si vychutnávaš.",
      description: "Čítaš pomaly a s chuťou. Každý príbeh si vychutnávaš ako dobré jedlo.",
    },
    Gamer: {
      title: "Čitateľ herných svetov",
      motif: "Lore a herné univerzá",
      insight: "Herný príbeh a lore ťa bavia rovnako ako samotné hranie.",
      description:
        "Herné svety, lore a univerzá ťa bavia rovnako ako hranie. Si doma v RPG, mapách a príbehoch z hier.",
    },
    Vsehochut: {
      title: "Všehochuť",
      motif: "Pestrosť a zvedavosť",
      insight: "Neviažeš sa na jeden žáner — baví ťa pestrosť a mix.",
      description:
        "Máš chuť na všetko – od príbehov po fakty. Neviažeš sa na jeden žáner, baví ťa pestrosť.",
    },
  },

  cz: {
    Bezkniznik: {
      title: "Prázdná knihovna",
      motif: "Žádné knihy na dohled",
      insight: "Tvoje příběhy na tebe zatím čekají.",
      description:
        "Na fotce nevidím knihy nebo čitelné hřbety. Zkus vyfotit polici s knihami a lepším světlem.",
    },
    Manga: {
      title: "Manga",
      motif: "Série a vizuální příběhy",
      insight: "Příběh v obrazech je tvůj jazyk — série a postavy jsou návykové.",
      description:
        "Příběh v obrazech je tvůj jazyk. Miluješ série, postavy a světy, které rostou díl po díle.",
    },
    Fantasta: {
      title: "Fantasta",
      motif: "Fantasy a magie",
      insight: "Únik do jiných světů je tvůj druhý domov.",
      description:
        "Únik do jiných světů je tvůj druhý domov. Fantasy, magie a představivost jsou tvoje síla.",
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
      motif: "Temno a mrazení",
      insight: "Mrazení v zádech je tvé guilty pleasure — čteš i potmě.",
      description:
        "Baví tě mrazení v zádech, temná atmosféra a napětí, které nejde odložit. Čteš i potmě.",
    },
    Romantik: {
      title: "Romantik",
      motif: "Emoce a vztahy",
      insight: "Čtení je pro tebe zážitek srdce — hledáš emoce a blízkost.",
      description:
        "Hledáš emoce, vztahy a silné lidské příběhy. Čtení je pro tebe zážitek srdce.",
    },
    Poetik: {
      title: "Poetik",
      motif: "Jazyk a atmosféra",
      insight: "Čteš pro krásu slov a ticho mezi nimi.",
      description: "Záleží ti na jazyku, atmosféře a emoci. Čteš pro krásu slov i ticha mezi nimi.",
    },
    Akcny: {
      title: "Čtenář v tempu",
      motif: "Akce a adrenalin",
      insight: "Když kniha chytne, jedeš bez pauzy až do konce.",
      description: "Máš rád tempo, napětí a silný děj. Když kniha chytne, jedeš až do konce.",
    },
    Motivator: {
      title: "Motivátor",
      motif: "Růst a návyky",
      insight: "Knihy bereš jako impuls — chceš se posouvat a růst.",
      description: "Knihy bereš jako impuls k lepšímu životu. Rád na sobě pracuješ a posouváš se dál.",
    },
    Biznis: {
      title: "Strategický čtenář",
      motif: "Strategie a rozhodování",
      insight: "Čteš strategicky — baví tě úspěch, systém a rozhodování.",
      description: "Čteš strategicky. Zajímá tě úspěch, rozhodování a fungování světa kolem nás.",
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
      description: "Knihy jsou tu pro společné čtení — sdílené příběhy, které spojují děti i dospělé.",
    },
    Cestovatel: {
      title: "Cestovatel",
      motif: "Svět a kultury",
      insight: "Každá kniha je pro tebe cesta — místa, lidé, kultury.",
      description: "Každá kniha je pro tebe cesta. Zajímají tě místa, kultury a skutečné příběhy světa.",
    },
    Dobrodruh: {
      title: "Dobrodruh",
      motif: "Pohyb a objevování",
      insight: "Láká tě neznámo — knihy jsou výprava za hranice jistoty.",
      description: "Láká tě pohyb, objevování a neznámo. Knihy jsou pro tebe výpravou za hranice jistoty.",
    },
    Labuznik: {
      title: "Labužník",
      motif: "Vychutnávání a pohoda",
      insight: "Čteš pomalu a s chutí — příběh si vychutnáváš.",
      description: "Čteš pomalu a s chutí. Každý příběh si vychutnáváš jako dobré jídlo.",
    },
    Gamer: {
      title: "Čtenář herních světů",
      motif: "Lore a herní univerza",
      insight: "Herní příběh a lore tě baví stejně jako samotné hraní.",
      description:
        "Herní světy, lore a univerza tě baví stejně jako hraní. Jsi doma v RPG, mapách a příbězích z her.",
    },
    Vsehochut: {
      title: "Všehochuť",
      motif: "Pestrost a zvědavost",
      insight: "Nevážeš se na jeden žánr — baví tě pestrost a mix.",
      description:
        "Máš chuť na všechno – od příběhů po fakta. Nevážeš se na jeden žánr, baví tě pestrost.",
    },
  },

  en: {
    Bezkniznik: {
      title: "Empty Shelf",
      motif: "No books in sight",
      insight: "Your stories are still waiting for you.",
      description:
        "I can’t see books or readable spines in the photo. Try taking a clearer shot of your bookshelf with better light.",
    },
    Manga: {
      title: "Manga",
      motif: "Series & visual stories",
      insight: "Stories in panels are your language — series and characters are addictive.",
      description:
        "Stories in panels are your language. You love series, characters, and worlds that grow volume by volume.",
    },
    Fantasta: {
      title: "Fantasy Reader",
      motif: "Fantasy & magic",
      insight: "Escaping into other worlds feels like home.",
      description:
        "Escaping into other worlds feels like home. Fantasy, magic, and imagination are your superpower.",
    },
    Scifi: {
      title: "Future Thinker",
      motif: "Future & technology",
      insight: "You think ahead — you’re fascinated by where we’re headed.",
      description:
        "You think ahead. You’re drawn to the future, technology, and big questions about where we’re going.",
    },
    Detektiv: {
      title: "Mystery Solver",
      motif: "Mysteries & twists",
      insight: "You love finding the truth between the lines.",
      description: "You enjoy tension, clues, and twists. Your brain is always trying to solve the puzzle.",
    },
    Horor: {
      title: "Dark Reader",
      motif: "Shivers & shadows",
      insight: "That spine-tingling feeling is your guilty pleasure — even at night.",
      description:
        "You enjoy eerie atmosphere and page-turning tension. A good scare doesn’t stop you from reading after dark.",
    },
    Romantik: {
      title: "Romantic",
      motif: "Emotions & relationships",
      insight: "Reading is a heart experience — you seek closeness and feelings.",
      description:
        "You look for emotions, relationships, and strong human stories. Books are your way to feel deeply.",
    },
    Poetik: {
      title: "Poet",
      motif: "Language & atmosphere",
      insight: "You read for the beauty of words — and the silence between them.",
      description:
        "You care about language, mood, and emotion. You read for the craft of writing as much as the story.",
    },
    Akcny: {
      title: "Fast-Paced Reader",
      motif: "Action & adrenaline",
      insight: "When a book grabs you, you go non-stop to the end.",
      description:
        "You like momentum, tension, and strong plot. Once hooked, you binge until the last page.",
    },
    Motivator: {
      title: "Self-Improver",
      motif: "Growth & habits",
      insight: "Books are fuel — you want to grow and move forward.",
      description:
        "You read to improve your life. You enjoy insights, systems, and habits that help you level up.",
    },
    Biznis: {
      title: "Strategic Reader",
      motif: "Strategy & decisions",
      insight: "You read strategically — success, systems, and decision-making intrigue you.",
      description:
        "You’re into how the world works: business, strategy, leadership, and smart decision-making.",
    },
    Intelektual: {
      title: "Deep Thinker",
      motif: "Knowledge & connections",
      insight: "You read to connect dots — and go deep.",
      description:
        "You enjoy understanding the world in depth. Non-fiction, science, history, philosophy — you read for insight.",
    },
    Rodic: {
      title: "Parent & Child",
      motif: "Kids & shared time",
      insight: "Books are for reading together — shared stories that connect generations.",
      description:
        "Books are your shared ritual. Stories you read with kids (and for kids) matter as much as your own reading.",
    },
    Cestovatel: {
      title: "Traveler",
      motif: "World & cultures",
      insight: "Every book is a journey — places, people, cultures.",
      description:
        "You’re curious about places and cultures. You love real stories from the world — and learning through travel.",
    },
    Dobrodruh: {
      title: "Adventurer",
      motif: "Movement & discovery",
      insight: "You’re drawn to the unknown — books are expeditions beyond comfort.",
      description:
        "You like movement, exploration, and challenge. Stories feel like quests — pushing past the familiar.",
    },
    Labuznik: {
      title: "Slow Savorer",
      motif: "Comfort & enjoyment",
      insight: "You read slowly and with taste — you savor stories.",
      description:
        "You like cozy, feel-good reading. You take your time and enjoy the atmosphere as much as the plot.",
    },
    Gamer: {
      title: "Game-World Reader",
      motif: "Lore & universes",
      insight: "Game stories and lore fascinate you as much as playing itself.",
      description:
        "You love worlds, lore, and universes — RPG vibes, maps, factions, and stories rooted in games.",
    },
    Vsehochut: {
      title: "Omnivore",
      motif: "Variety & curiosity",
      insight: "You don’t stick to one genre — you love the mix.",
      description:
        "From stories to facts, you’re curious about everything. Your shelf is a buffet — and you like it that way.",
    },
  },
};

export function getArchetypeLocalized(locale: Locale, key: ArchetypeKey) {
  const base = ARCHETYPES[key];
  const text = TEXT[locale]?.[key] ?? TEXT.sk[key];
  return {
    ...base,
    ...text,
  };
}

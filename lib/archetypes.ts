// lib/archetypes.ts

export type ArchetypeKey =
  | "Bezkniznik"
  | "Manga"
  | "Fantasta"
  | "Scifi"
  | "Detektiv"
  | "Horor"
  | "Romantik"
  | "Poetik"
  | "Akcny"
  | "Motivator"
  | "Biznis"
  | "Intelektual"
  | "Rodic"
  | "Cestovatel"
  | "Dobrodruh"
  | "Labuznik"
  | "Gamer"
  | "Vsehochut";

export type ArchetypeTheme = {
  pageBg: string;
  /** nové: viac možností */
  imageSrcs?: string[];
  /** spätná kompatibilita (ak niekde ešte používaš) */
  imageSrc?: string;
};

export const ARCHETYPES = {
  Bezkniznik: {
    title: "Bezknižník",
    motif: "Žiadne knihy na dohľad",
    insight: "Na fotke nevidím knihy alebo čitateľné chrbty.",
    description:
      "Na fotke nevidím knihy alebo čitateľné chrbty. Skús odfotiť poličku s knihami a lepším svetlom.",
    theme: {
      pageBg: "rgba(255, 202, 171, 1)",
      imageSrcs: ["/assets/bezkniznik1.webp", "/assets/bezkniznik2.webp", "/assets/bezkniznik3.webp"],
    },
  },

  Manga: {
    title: "Manga",
    motif: "Série & vizuálne príbehy",
    insight: "Príbeh v obrazoch je tvoj jazyk — série a postavy sú návykové.",
    description:
      "Príbeh v obrazoch je tvoj jazyk. Miluješ série, postavy a svety, ktoré rastú diel po diele.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrcs: ["/assets/manga1.webp", "/assets/manga2.webp", "/assets/manga3.webp"],
    },
  },

  Gamer: {
    title: "Gamer",
    motif: "Lore & herné univerzá",
    insight: "Herný príbeh a lore ťa bavia rovnako ako samotné hranie.",
    description:
      "Herné svety, lore a univerzá ťa bavia rovnako ako hranie. Si doma v RPG, mapách a príbehoch z hier.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrcs: ["/assets/gamer1.webp", "/assets/gamer2.webp", "/assets/gamer3.webp"],
    },
  },

  Fantasta: {
    title: "Fantasta",
    motif: "Fantázia & mágia",
    insight: "Únik do iných svetov je tvoj druhý domov.",
    description:
      "Únik do iných svetov je tvoj druhý domov. Fantázia, mágia a predstavivosť sú tvoja sila.",
    theme: {
      pageBg: "rgba(108, 89, 136, 1)",
      imageSrcs: ["/assets/fantasta1.webp", "/assets/fantasta2.webp", "/assets/fantasta3.webp"],
    },
  },

  Scifi: {
    title: "Vizionár",
    motif: "Budúcnosť & technológie",
    insight: "Premýšľaš dopredu — fascinuje ťa, kam smerujeme.",
    description:
      "Premýšľaš dopredu. Fascinuje ťa budúcnosť, technológie a otázky, kam smerujeme.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrcs: ["/assets/scifi1.webp", "/assets/scifi2.webp", "/assets/scifi3.webp"],
    },
  },

  Detektiv: {
    title: "Detektív",
    motif: "Záhady & zvraty",
    insight: "Baví ťa hľadať pravdu medzi riadkami.",
    description: "Baví ťa hľadať pravdu medzi riadkami. Napätie, záhady a zvraty sú tvoj svet.",
    theme: {
      pageBg: "rgba(155, 113, 80, 1)",
      imageSrcs: ["/assets/detektiv1.webp", "/assets/detektiv2.webp", "/assets/detektiv3.webp"],
    },
  },

  Horor: {
    title: "Hororista",
    motif: "Temno & mrazenie",
    insight: "Mrazenie v chrbte je tvoj guilty pleasure — čítaš aj po tme.",
    description:
      "Baví ťa mrazenie v chrbte, temná atmosféra a napätie, ktoré sa nedá odložiť. Čítaš aj po tme.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrcs: ["/assets/horor1.webp", "/assets/horor2.webp", "/assets/horor3.webp"],
    },
  },

  Akcny: {
    title: "Akčný čitateľ",
    motif: "Tempo & adrenalín",
    insight: "Keď kniha chytí, ideš bez prestávky až do konca.",
    description:
      "Máš rád tempo, napätie a silný dej. Keď kniha chytí, ideš bez prestávky až do konca.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrcs: ["/assets/akcny1.webp", "/assets/akcny2.webp", "/assets/akcny3.webp"],
    },
  },

  Romantik: {
    title: "Romantik",
    motif: "Emócie & vzťahy",
    insight: "Čítanie je pre teba zážitok srdca — hľadáš emócie a blízkosť.",
    description: "Hľadáš emócie, vzťahy a silné ľudské príbehy. Čítanie je pre teba zážitok srdca.",
    theme: {
      pageBg: "rgba(217, 135, 101, 1)",
      imageSrcs: ["/assets/romantik1.webp", "/assets/romantik2.webp", "/assets/romantik3.webp"],
    },
  },

  Poetik: {
    title: "Poetik",
    motif: "Jazyk & atmosféra",
    insight: "Čítaš pre krásu slov a ticho medzi nimi.",
    description: "Záleží ti na jazyku, atmosfére a emócii. Čítaš pre krásu slov a ticha medzi nimi.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrcs: ["/assets/poetik1.webp", "/assets/poetik2.webp", "/assets/poetik3.webp"],
    },
  },

  Motivator: {
    title: "Motivátor",
    motif: "Rast & návyky",
    insight: "Knihy berieš ako impulz — chceš sa posúvať a rásť.",
    description: "Knihy berieš ako impulz k lepšiemu životu. Rád na sebe pracuješ a posúvaš sa ďalej.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrcs: ["/assets/motivator1.webp", "/assets/motivator2.webp", "/assets/motivator3.webp"],
    },
  },

  Biznis: {
    title: "Biznis",
    motif: "Stratégia & rozhodovanie",
    insight: "Čítaš strategicky — baví ťa úspech, systém a rozhodovanie.",
    description: "Čítaš strategicky. Zaujíma ťa úspech, rozhodovanie a fungovanie sveta okolo nás.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrcs: ["/assets/biznis1.webp", "/assets/biznis2.webp", "/assets/biznis3.webp"],
    },
  },

  Intelektual: {
    title: "Intelektuál",
    motif: "Poznanie & súvislosti",
    insight: "Čítaš, aby si videl súvislosti — ideš do hĺbky.",
    description:
      "Baví ťa chápať svet do hĺbky. Non-fiction, veda, história či filozofia – čítaš, aby si videl súvislosti.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrcs: ["/assets/intelektual1.webp", "/assets/intelektual2.webp", "/assets/intelektual3.webp"],
    },
  },

  Rodic: {
    title: "Rodič",
    motif: "Deti & spoločný čas",
    insight: "Knihy sú pre teba aj mostom k deťom — pre seba aj spolu.",
    description: "Knihy sú pre teba aj mostom k deťom. Čítaš pre seba, aj pre spoločné chvíle.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrcs: ["/assets/rodic1.webp", "/assets/rodic2.webp", "/assets/rodic3.webp"],
    },
  },

  Cestovatel: {
    title: "Cestovateľ",
    motif: "Svet & kultúry",
    insight: "Každá kniha je pre teba cesta — miesta, ľudia, kultúry.",
    description: "Každá kniha je pre teba cesta. Zaujíma ťa miesta, kultúry a skutočné príbehy sveta.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrcs: ["/assets/cestovatel1.webp", "/assets/cestovatel2.webp", "/assets/cestovatel3.webp"],
    },
  },

  Dobrodruh: {
    title: "Dobrodruh",
    motif: "Pohyb & objavovanie",
    insight: "Láka ťa neznámo — knihy sú výprava za hranice istoty.",
    description: "Láka ťa pohyb, objavovanie a neznámo. Knihy sú pre teba výpravou za hranice istoty.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrcs: ["/assets/dobrodruh1.webp", "/assets/dobrodruh2.webp", "/assets/dobrodruh3.webp"],
    },
  },

  Labuznik: {
    title: "Labužník",
    motif: "Vychutnávanie & pohoda",
    insight: "Čítaš pomaly a s chuťou — príbeh si vychutnávaš.",
    description: "Čítaš pomaly a s chuťou. Každý príbeh si vychutnávaš ako dobré jedlo.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrcs: ["/assets/labuznik1.webp", "/assets/labuznik2.webp", "/assets/labuznik3.webp"],
    },
  },

  Vsehochut: {
    title: "Všehochuť",
    motif: "Pestrosť & zvedavosť",
    insight: "Neviažeš sa na jeden žáner — baví ťa pestrosť a mix.",
    description:
      "Máš chuť na všetko – od príbehov po fakty. Neviažeš sa na jeden žáner, baví ťa pestrosť.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrcs: ["/assets/vsehochut1.webp", "/assets/vsehochut2.webp", "/assets/vsehochut3.webp"],
    },
  },
} satisfies Record<
  ArchetypeKey,
  {
    title: string;
    motif: string;
    insight: string;
    description: string;
    theme: ArchetypeTheme;
  }
>;

export type ArchetypeMeta = (typeof ARCHETYPES)[ArchetypeKey];

export type ArchetypeKey =
  | "Bezkniznik"
  | "Gamer"
  | "Myslitel"
  | "Fantasta"
  | "Labuznik"
  | "Dobrodruh"
  | "Romantik"
  | "Detektiv"
  | "Motivator"
  | "Minimalista"
  | "Ucenec"
  | "Rodic"
  | "Cestovatel"
  | "Biznis"
  | "Scifi"
  | "Poetik";

type ArchetypeTheme = {
  // Pozadie celej stránky: môže byť rgba(...) alebo aj linear-gradient(...)
  pageBg: string;
  // Cesta k WEBP / obrázku archetypu (zatiaľ fallbackuješ na home.webp)
  imageSrc?: string;
};

export const ARCHETYPES = {
  Bezkniznik: {
    title: "Bezknižník",
    description:
      "Na fotke nevidím knihy alebo čitateľné chrbty. Skús odfotiť poličku s knihami a lepším svetlom.",
    theme: {
      // #ffcaab (jemné pozadie)
      pageBg: "rgba(255, 202, 171, 0.18)",
      imageSrc: "/assets/home.webp",
    },
  },

  Gamer: {
    title: "Gamer",
    description:
      "Hľadáš napätie, tempo a silné príbehy. Čítaš ako hráš – naplno a bez kompromisov.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrc: "/assets/home.webp",
    },
  },

  Myslitel: {
    title: "Mysliteľ",
    description:
      "Knihy sú pre teba nástrojom porozumenia. Baví ťa premýšľať do hĺbky a klásť otázky.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrc: "/assets/home.webp",
    },
  },

  Fantasta: {
    title: "Fantasta",
    description:
      "Únik do iných svetov je tvoj druhý domov. Fantázia, mágia a predstavivosť sú tvoja sila.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrc: "/assets/home.webp",
    },
  },

  Labuznik: {
    title: "Labužník",
    description:
      "Čítaš pomaly a s chuťou. Každý príbeh si vychutnávaš ako dobré jedlo.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrc: "/assets/home.webp",
    },
  },

  Dobrodruh: {
    title: "Dobrodruh",
    description:
      "Láka ťa pohyb, objavovanie a neznámo. Knihy sú pre teba výpravou za hranice istoty.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrc: "/assets/home.webp",
    },
  },

  Romantik: {
    title: "Romantik",
    description:
      "Hľadáš emócie, vzťahy a silné ľudské príbehy. Čítanie je pre teba zážitok srdca.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrc: "/assets/home.webp",
    },
  },

  Detektiv: {
    title: "Detektív",
    description:
      "Baví ťa hľadať pravdu medzi riadkami. Napätie, záhady a zvraty sú tvoj svet.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrc: "/assets/home.webp",
    },
  },

  Motivator: {
    title: "Motivátor",
    description:
      "Knihy berieš ako impulz k lepšiemu životu. Rád na sebe pracuješ a posúvaš sa ďalej.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrc: "/assets/home.webp",
    },
  },

  Minimalista: {
    title: "Minimalista",
    description:
      "Menej je viac. Vyberáš si knihy cielene a čítaš len to, čo má pre teba hodnotu.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrc: "/assets/home.webp",
    },
  },

  Ucenec: {
    title: "Učenec",
    description:
      "Vzdelávanie je tvoj prirodzený režim. Čítaš, aby si vedel viac a lepšie rozumel svetu.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrc: "/assets/home.webp",
    },
  },

  Rodic: {
    title: "Rodič",
    description:
      "Knihy sú pre teba aj mostom k deťom. Čítaš pre seba, aj pre spoločné chvíle.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrc: "/assets/home.webp",
    },
  },

  Cestovatel: {
    title: "Cestovateľ",
    description:
      "Každá kniha je pre teba cesta. Zaujímajú ťa miesta, kultúry a skutočné príbehy sveta.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrc: "/assets/home.webp",
    },
  },

  Biznis: {
    title: "Biznis",
    description:
      "Čítaš strategicky. Zaujíma ťa úspech, rozhodovanie a fungovanie sveta okolo nás.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrc: "/assets/home.webp",
    },
  },

  Scifi: {
    title: "Vizionár",
    description:
      "Premýšľaš dopredu. Fascinuje ťa budúcnosť, technológie a otázky, kam smerujeme.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrc: "/assets/home.webp",
    },
  },

  Poetik: {
    title: "Poetik",
    description:
      "Záleží ti na jazyku, atmosfére a emócii. Čítaš pre krásu slov a ticha medzi nimi.",
    theme: {
      pageBg: "rgba(255, 255, 255, 1)",
      imageSrc: "/assets/home.webp",
    },
  },
} satisfies Record<
  ArchetypeKey,
  {
    title: string;
    description: string;
    theme: ArchetypeTheme;
  }
>;

export type ArchetypeMeta = (typeof ARCHETYPES)[ArchetypeKey];

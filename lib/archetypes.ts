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

export const ARCHETYPES: Record<
  ArchetypeKey,
  {
    title: string;
    description: string;
  }
> = {
  Bezkniznik: {
    title: "Bezknižník",
    description:
      "Na fotke nevidím knihy alebo čitateľné chrbty. Skús odfotiť poličku s knihami a lepším svetlom.",
  },

  Gamer: {
    title: "Gamer",
    description:
      "Hľadáš napätie, tempo a silné príbehy. Čítaš ako hráš – naplno a bez kompromisov.",
  },

  Myslitel: {
    title: "Mysliteľ",
    description:
      "Knihy sú pre teba nástrojom porozumenia. Baví ťa premýšľať do hĺbky a klásť otázky.",
  },

  Fantasta: {
    title: "Fantasta",
    description:
      "Únik do iných svetov je tvoj druhý domov. Fantázia, mágia a predstavivosť sú tvoja sila.",
  },

  Labuznik: {
    title: "Labužník",
    description:
      "Čítaš pomaly a s chuťou. Každý príbeh si vychutnávaš ako dobré jedlo.",
  },

  Dobrodruh: {
    title: "Dobrodruh",
    description:
      "Láka ťa pohyb, objavovanie a neznámo. Knihy sú pre teba výpravou za hranice istoty.",
  },

  Romantik: {
    title: "Romantik",
    description:
      "Hľadáš emócie, vzťahy a silné ľudské príbehy. Čítanie je pre teba zážitok srdca.",
  },

  Detektiv: {
    title: "Detektív",
    description:
      "Baví ťa hľadať pravdu medzi riadkami. Napätie, záhady a zvraty sú tvoj svet.",
  },

  Motivator: {
    title: "Motivátor",
    description:
      "Knihy berieš ako impulz k lepšiemu životu. Rád na sebe pracuješ a posúvaš sa ďalej.",
  },

  Minimalista: {
    title: "Minimalista",
    description:
      "Menej je viac. Vyberáš si knihy cielene a čítaš len to, čo má pre teba hodnotu.",
  },

  Ucenec: {
    title: "Učenec",
    description:
      "Vzdelávanie je tvoj prirodzený režim. Čítaš, aby si vedel viac a lepšie rozumel svetu.",
  },

  Rodic: {
    title: "Rodič",
    description:
      "Knihy sú pre teba aj mostom k deťom. Čítaš pre seba, aj pre spoločné chvíle.",
  },

  Cestovatel: {
    title: "Cestovateľ",
    description:
      "Každá kniha je pre teba cesta. Zaujímajú ťa miesta, kultúry a skutočné príbehy sveta.",
  },

  Biznis: {
    title: "Biznis",
    description:
      "Čítaš strategicky. Zaujíma ťa úspech, rozhodovanie a fungovanie sveta okolo nás.",
  },

  Scifi: {
    title: "Vizionár",
    description:
      "Premýšľaš dopredu. Fascinuje ťa budúcnosť, technológie a otázky, kam smerujeme.",
  },

  Poetik: {
    title: "Poetik",
    description:
      "Záleží ti na jazyku, atmosfére a emócii. Čítaš pre krásu slov a ticha medzi nimi.",
  },
};

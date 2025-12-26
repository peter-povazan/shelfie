// lib/dict.ts
import type { Locale } from "@/lib/i18n";
export type { Locale } from "@/lib/i18n";

export const UI = {
  sk: {
    backHome: "späť na úvod",
    home: "Domov",
    about: "O projekte",
    privacy: "Súkromie",
    terms: "Podmienky",

    heroTitle: "Čo prezradí tvoja knižnica?",
    heroSubtitle: "Odfoť ju a zisti svoj book vibe.",
    tip: "TIP:",
    tipText: "čitateľné chrbty kníh, bez odlesku a s dobrým svetlom.",

    analyzing: "ANALYZUJEM",
    cta: "Aký mám book vibe?",

    share: "Zdieľať",
    preparing: "Pripravujem…",
    download: "Stiahnuť",
    next: "Urobiť ďalšiu Shelfie →",
    shareReady: "Pripravené na zdieľanie 👌",
    downloaded: "Stiahnuté ako PNG ✅",
    exportFail: "Nepodarilo sa pripraviť obrázok. Skús znova.",
    downloadFail: "Nepodarilo sa stiahnuť obrázok. Skús znova.",

    // (ak máš switcher)
    language: "Jazyk",
  },

  cz: {
    backHome: "zpět na úvod",
    home: "Domů",
    about: "O projektu",
    privacy: "Soukromí",
    terms: "Podmínky",

    heroTitle: "Co prozradí tvoje knihovna?",
    heroSubtitle: "Vyfoť ji a zjisti svůj book vibe.",
    tip: "TIP:",
    tipText: "čitelné hřbety knih, bez odlesku a s dobrým světlem.",

    analyzing: "ANALYZUJI",
    cta: "Jaký mám book vibe?",

    share: "Sdílet",
    preparing: "Připravuji…",
    download: "Stáhnout",
    next: "Udělat další Shelfie →",
    shareReady: "Připravené ke sdílení 👌",
    downloaded: "Staženo jako PNG ✅",
    exportFail: "Nepodařilo se připravit obrázek. Zkus to znovu.",
    downloadFail: "Nepodařilo se stáhnout obrázek. Zkus to znovu.",

    language: "Jazyk",
  },

  en: {
    backHome: "back to home",
    home: "Home",
    about: "About",
    privacy: "Privacy",
    terms: "Terms",

    heroTitle: "What does your bookshelf reveal?",
    heroSubtitle: "Snap it and discover your book vibe.",
    tip: "TIP:",
    tipText: "clear spines, no glare, good light.",

    analyzing: "ANALYZING",
    cta: "What’s my book vibe?",

    share: "Share",
    preparing: "Preparing…",
    download: "Download",
    next: "Make another Shelfie →",
    shareReady: "Ready to share 👌",
    downloaded: "Downloaded as PNG ✅",
    exportFail: "Couldn’t prepare the image. Try again.",
    downloadFail: "Couldn’t download the image. Try again.",

    language: "Language",
  },
} as const;

export function t(locale: Locale) {
  return UI[locale] ?? UI.sk;
}

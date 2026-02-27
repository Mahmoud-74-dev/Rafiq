export type Tab = 'home' | 'quran' | 'adhkar' | 'tasbeeh' | 'ramadan';

export interface Thikr {
  id: number;
  text: string;
  count: number;
  description?: string;
  reference?: string;
}

export interface AdhkarCategory {
  id: string;
  title: string;
  items: Thikr[];
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | object;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}

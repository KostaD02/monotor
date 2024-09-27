export enum LanguageLocals {
  EN = 'en',
  KA = 'ka',
}

export interface Langauge {
  title: string;
  local: LanguageLocals;
  image: string;
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export enum ThemeOptions {
  Light = 'light',
  Dark = 'dark',
  OS = 'os',
}

export interface ThemeItem {
  local: string;
  value: ThemeOptions;
}

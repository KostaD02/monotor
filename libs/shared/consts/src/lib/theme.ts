import { ThemeItem, ThemeOptions } from '@fitmonitor/interfaces';

export const THEME_ITEMS: ThemeItem[] = [
  {
    local: 'theme.light',
    value: ThemeOptions.Light,
  },
  {
    local: 'theme.dark',
    value: ThemeOptions.Dark,
  },
  {
    local: 'theme.os',
    value: ThemeOptions.OS,
  }
]
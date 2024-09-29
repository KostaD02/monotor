import { inject, Injectable, signal } from '@angular/core';
import { LanguageLocals, StorageKeys } from '@fitmonitor/interfaces';
import { LANGUAGES } from '@fitmonitor/consts';

import { TranslateService } from '@ngx-translate/core';

import { LocalStorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translateService = inject(TranslateService);
  private readonly localStorageService = inject(LocalStorageService);

  readonly state = signal(LanguageLocals.EN);

  get language() {
    return this.localStorageService.getItem(StorageKeys.Language) || '';
  }

  set language(language: string) {
    if (!language || !this.isSupportedLanguage(language)) {
      language = LanguageLocals.EN;
    }

    const local = this.getLanguageLocal(language);

    this.localStorageService.setItem(StorageKeys.Language, local);
    this.translateService.use(language);

    this.state.set(local);
  }

  init() {
    const prev = this.language;
    this.language = prev;
  }

  getLanguageLocal(language: string) {
    return (
      LANGUAGES.find((lang) => lang.local === language)?.local ||
      LanguageLocals.EN
    );
  }

  isSupportedLanguage(language: string) {
    return LANGUAGES.some((lang) => lang.local === language);
  }

  translate(key: string) {
    return this.translateService.instant(key);
  }
}

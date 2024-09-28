import {
  inject,
  Injectable,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageLocals, StorageKeys } from '@fitmonitor/interfaces';
import { LANGUAGES } from '@fitmonitor/consts';
import { LocalStorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService implements OnInit {
  private readonly translateService = inject(TranslateService);
  private readonly localStorageService = inject(LocalStorageService);

  readonly state: WritableSignal<LanguageLocals> = signal(LanguageLocals.EN);

  get language() {
    return this.translateService.currentLang;
  }

  set language(language: string) {
    if (!language || !this.isSupportedLanguage(language)) {
      language = LanguageLocals.EN;
    }

    this.localStorageService.setItem(StorageKeys.Language, language);
    this.translateService.use(language);

    this.state.set(this.getLanguageLocal(language));
  }

  ngOnInit(): void {
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

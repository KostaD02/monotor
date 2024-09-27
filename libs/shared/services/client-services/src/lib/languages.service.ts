import { inject, Injectable, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { LanguageLocals, StorageKeys } from '@fitmonitor/interfaces';
import { LANGUAGES } from '@fitmonitor/consts';
import { LocalStorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService implements OnInit {
  private readonly translateService = inject(TranslateService);
  private readonly localStorageService = inject(LocalStorageService);

  readonly #language = new BehaviorSubject<string>(LanguageLocals.EN);
  readonly language$ = this.#language.asObservable();

  get language() {
    return this.localStorageService.getItem(StorageKeys.Language) || '';
  }

  set language(language: string) {
    if (!language || !this.isSupportedLanguage(language)) {
      language = LanguageLocals.EN;
    }

    this.localStorageService.setItem(StorageKeys.Language, language);
    this.translateService.use(language);

    this.#language.next(language);
  }

  ngOnInit(): void {
    const prev = this.language;
    this.language = prev;
  }

  isSupportedLanguage(language: string) {
    return LANGUAGES.some((lang) => lang.local === language);
  }

  translate(key: string) {
    return this.translateService.instant(key);
  }
}

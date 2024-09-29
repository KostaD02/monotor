import { inject, Injectable } from '@angular/core';
import { StorageKeys, Theme, ThemeOptions } from '@fitmonitor/interfaces';
import { LocalStorageService } from './storage.service';
import { DOCUMENT } from '@angular/common';
import {
  BehaviorSubject,
  startWith,
  switchMap,
  of,
  fromEvent,
  map,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly localStorageService = inject(LocalStorageService);
  private readonly document = inject(DOCUMENT);

  readonly #selectedMode$ = new BehaviorSubject<ThemeOptions>(ThemeOptions.OS);
  readonly selectedMode$ = this.#selectedMode$.asObservable();

  readonly theme$ = this.#selectedMode$.pipe(
    startWith(ThemeOptions.OS),
    switchMap((theme) => {
      switch (theme) {
        case ThemeOptions.Light: {
          return of(Theme.Light);
        }

        case ThemeOptions.Dark: {
          return of(Theme.Dark);
        }

        default: {
          const query = this.document.defaultView?.matchMedia(
            '(prefers-color-scheme: dark)'
          );
          if (!query) {
            return of(Theme.Light);
          }
          return fromEvent(query, 'change').pipe(
            startWith(query),
            map((query) => {
              const matches = (query as MediaQueryList).matches;
              return matches ? Theme.Dark : Theme.Light;
            })
          );
        }
      }
    })
  );

  init() {
    const prevTheme = this.localStorageService.getItem(
      StorageKeys.Theme
    ) as ThemeOptions | null;
    if (prevTheme) {
      this.#selectedMode$.next(prevTheme);
    }
    return this.theme$.pipe(
      tap((theme) => {
        this.applyThemeToDoc(theme);
      })
    );
  }

  setTheme(theme: ThemeOptions) {
    this.#selectedMode$.next(theme);
  }

  private applyThemeToDoc(theme: Theme) {
    const documentClassList = this.document.documentElement.classList;
    if (theme === Theme.Dark) {
      documentClassList.add(Theme.Dark);
      documentClassList.remove(Theme.Light);
    } else {
      documentClassList.add(Theme.Light);
      documentClassList.remove(Theme.Dark);
    }
    this.localStorageService.setItem(StorageKeys.Theme, theme);
  }
}

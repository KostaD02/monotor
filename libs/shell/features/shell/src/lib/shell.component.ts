import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Signal,
  signal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, fromEvent, map, startWith } from 'rxjs';

import { ThemeService } from '@fitmonitor/client-services';
import { AuthService } from '@fitmonitor/data-access';
import { Navigation, ThemeOptions } from '@fitmonitor/interfaces';
import { NAVIGATION } from '@fitmonitor/providers';
import {
  BURGER_MENU_BREAKPOINT,
  LANGUAGES,
  THEME_ITEMS,
} from '@fitmonitor/consts';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModeType, NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'fitmonitor-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NzLayoutModule,
    NzIconModule,
    NzMenuModule,
    NzButtonModule,
    NzDropDownModule,
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly viewport = inject(ViewportScroller);
  private readonly navigationData = inject(NAVIGATION);
  private readonly document = inject(DOCUMENT);

  readonly languages = LANGUAGES;
  readonly themeOptions = THEME_ITEMS;
  readonly theme = toSignal(this.themeService.theme$);

  readonly currentRoute$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map(() => this.router.url),
  );

  readonly windowResied$ = fromEvent(
    this.document.defaultView as Window,
    'resize',
  ).pipe(
    map((event) => (event.target as Window).innerWidth),
    startWith(this.document.body.clientWidth),
  );

  readonly isOpen = signal(false);
  readonly menuMode: Signal<NzMenuModeType> = computed(() =>
    this.isOpen() ? 'vertical' : 'horizontal',
  );
  readonly isUserAuthorized = computed(() => this.authService.user() !== null);
  readonly resizedWindowSize = toSignal(this.windowResied$);
  readonly currentRoute = toSignal(this.currentRoute$);
  readonly navigation: Signal<Navigation[]> = computed(() => {
    const isUserAuthorized = this.isUserAuthorized();
    return this.navigationData.filter(
      (nav) =>
        (nav.showAfterAuth === isUserAuthorized &&
          nav.showBeforeAuth === !isUserAuthorized) ||
        (nav.showBeforeAuth && nav.showAfterAuth),
    );
  });

  constructor() {
    this.themeService.init().pipe().subscribe();
    effect(
      () => {
        const size = this.resizedWindowSize() || this.document.body.clientWidth;
        if (this.isOpen() && size > BURGER_MENU_BREAKPOINT) {
          this.isOpen.set(false);
          this.document.body.style.overflow = 'visible';
        }
      },
      { allowSignalWrites: true },
    );
  }

  toggle() {
    this.isOpen.set(!this.isOpen());
    this.document.body.style.overflow = this.isOpen() ? 'hidden' : 'visible';
    this.viewport.scrollToPosition([0, 0]);
  }

  changeTheme(value: ThemeOptions) {
    this.themeService.setTheme(value);
  }
}

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

import { ThemeService } from '@monotor/client-services';
import { AuthService } from '@monotor/data-access';
import { Navigation, ThemeOptions, UserRole } from '@monotor/interfaces';
import { NAVIGATION } from '@monotor/providers';
import {
  BURGER_MENU_BREAKPOINT,
  HIDE_ICONS_BREAKPOINT,
  LANGUAGES,
  THEME_ITEMS,
} from '@monotor/consts';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModeType, NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'monotor-shell',
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
  private readonly document = inject(DOCUMENT);
  private readonly navigationData = inject(NAVIGATION);
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly viewport = inject(ViewportScroller);
  private readonly notifcationService = inject(NzNotificationService);

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
  readonly showIcons = computed(() => {
    const size = this.resizedWindowSize() || this.document.body.clientWidth;
    return size > HIDE_ICONS_BREAKPOINT || size < BURGER_MENU_BREAKPOINT;
  });
  readonly currentRoute = toSignal(this.currentRoute$);
  readonly navigation: Signal<Navigation[]> = computed(() => {
    const isUserAuthorized = this.isUserAuthorized();
    const userRole = this.authService.user()?.role;
    // prettier-ignore
    return this.navigationData.filter(
      (nav) =>
        (nav.showAfterAuth === isUserAuthorized && nav.showBeforeAuth === !isUserAuthorized) ||
        (nav.showBeforeAuth && nav.showAfterAuth),
    ).filter((nav) => nav.adminOnly ? userRole === UserRole.Admin : true);
  });

  constructor() {
    this.themeService.init().subscribe();
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

  logOut() {
    this.authService.signOut();
    this.notifcationService.success('Success', 'Logged out');
  }
}

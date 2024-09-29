import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LanguageService, ThemeService } from '@fitmonitor/client-services';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModeType, NzMenuModule } from 'ng-zorro-antd/menu';
import { AuthService } from '@fitmonitor/data-access';
import { Navigation } from '@fitmonitor/interfaces';
import { NAVIGATION } from '@fitmonitor/consts';

@Component({
  selector: 'fitmonitor-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NzLayoutModule,
    NzIconModule,
    NzMenuModule,
  ],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ShellComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly languageService = inject(LanguageService);

  readonly isCollapsed = signal(false);
  readonly menuMode: WritableSignal<NzMenuModeType> = signal('horizontal');
  readonly isUserAuthorized = computed(() => this.authService.user() !== null);
  readonly navigation: Signal<Navigation[]> = computed(() => {
    const isUserAuthorized = this.isUserAuthorized();
    return NAVIGATION.filter(
      (nav) =>
        nav.showAfterAuth === isUserAuthorized &&
        nav.showBeforeAuth === !isUserAuthorized
    );
  });

  ngOnInit(): void {
    this.languageService.init();
    this.themeService.init().pipe().subscribe();
  }

  toggle() {
    this.isCollapsed.set(!this.isCollapsed());
  }
}

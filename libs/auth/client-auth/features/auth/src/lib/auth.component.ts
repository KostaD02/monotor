import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { catchError, NEVER, tap } from 'rxjs';

import { UserLoginData, UserRegistrationData } from '@fitmonitor/interfaces';
import { AuthService } from '@fitmonitor/data-access';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { FormComponent } from '@fitmonitor/shared/ui/form';
import { LOGIN_FORM_DATA, REGISTER_FORM_DATA } from '@fitmonitor/consts';

@Component({
  selector: 'fitmonitor-auth',
  standalone: true,
  imports: [NzLayoutModule, NzTabsModule, FormComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NzNotificationService);
  private readonly router = inject(Router);

  readonly currentTabIndex = signal(0);

  readonly signInFormItems = LOGIN_FORM_DATA;
  readonly signUpFormItems = REGISTER_FORM_DATA;

  onAuth(data: unknown) {
    this.authService
      .signIn(data as UserLoginData)
      .pipe(
        tap((result) => {
          this.notificationService.info('Sign in successful', 'Welcome back!');
          this.authService.setTokens(result);
          this.router.navigate(['/']);
        }),
        catchError(() => NEVER),
      )
      .subscribe();
  }

  onRegistration(data: unknown) {
    this.authService
      .signUp(data as UserRegistrationData)
      .pipe(
        tap(() => {
          this.notificationService.info(
            'Registration successful',
            'Please sign in',
          );
          this.currentTabIndex.set(0);
        }),
        catchError(() => NEVER),
      )
      .subscribe();
  }
}

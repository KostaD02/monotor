import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { catchError, NEVER, tap } from 'rxjs';

import { SignInComponent } from '@fitmonitor/auth/client-auth/ui/sign-in';
import { SignUpComponent } from '@fitmonitor/auth/client-auth/ui/sign-up';
import { UserLoginData, UserRegistrationData } from '@fitmonitor/interfaces';
import { AuthService } from '@fitmonitor/data-access';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'fitmonitor-auth',
  standalone: true,
  imports: [NzLayoutModule, NzTabsModule, SignInComponent, SignUpComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NzNotificationService);
  private readonly router = inject(Router);

  readonly currentTabIndex = signal(0);

  onAuth(data: UserLoginData) {
    this.authService
      .signIn(data)
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

  onRegistration(data: UserRegistrationData) {
    this.authService
      .signUp(data)
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

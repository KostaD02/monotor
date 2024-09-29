import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { SignInComponent } from '@fitmonitor/auth/client-auth/ui/sign-in';
import { SignUpComponent } from '@fitmonitor/auth/client-auth/ui/sign-up';
import { UserLoginData, UserRegistrationData } from '@fitmonitor/interfaces';
import { AuthService } from '@fitmonitor/data-access';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { catchError, of, take, tap } from 'rxjs';

@Component({
  selector: 'fitmonitor-auth',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzTabsModule,
    TranslateModule,
    SignInComponent,
    SignUpComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private readonly authService = inject(AuthService);

  readonly currentTabIndex = signal(0);

  onAuth(data: UserLoginData) {
    this.authService
      .signIn(data)
      .pipe(
        take(1),
        tap((result) => {
          console.log(result);
        }),
        catchError((error) => {
          console.log(error);
          return of(false);
        }),
      )
      .subscribe();
  }

  onRegistration(data: UserRegistrationData) {
    this.currentTabIndex.set(1);
    console.log(data);
  }
}

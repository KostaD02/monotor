import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { SignInComponent } from '@fitmonitor/auth/client-auth/ui/sign-in';
import { SignUpComponent } from '@fitmonitor/auth/client-auth/ui/sign-up';
import { UserLoginData, UserRegistrationData } from '@fitmonitor/interfaces';

import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

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
  readonly currentTabIndex = signal(0);

  onAuth(data: UserLoginData) {
    console.log(data);
  }

  onRegistration(data: UserRegistrationData) {
    this.currentTabIndex.set(1);
    console.log(data);
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { LanguageService } from '@fitmonitor/client-services';
import { API_CONFIG } from '@fitmonitor/consts';
import { UserRegistrationData } from '@fitmonitor/interfaces';
import { TranslateModule } from '@ngx-translate/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'fitmonitor-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzAlertModule,
    NzButtonModule,
    TranslateModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  @Output() formSubmit = new EventEmitter<UserRegistrationData>();

  private readonly fb = inject(FormBuilder);
  private readonly languageService = inject(LanguageService);
  private readonly notificationService = inject(NzNotificationService);

  readonly form = this.fb.group({
    firstName: this.fb.control('', [
      Validators.required,
      Validators.minLength(API_CONFIG.MIN_FIRSTNAME_LENGTH),
      Validators.maxLength(API_CONFIG.MAX_FIRSTNAME_LENGTH),
    ]),
    lastName: this.fb.control('', [
      Validators.required,
      Validators.minLength(API_CONFIG.MIN_LASTNAME_LENGTH),
      Validators.maxLength(API_CONFIG.MAX_LASTNAME_LENGTH),
    ]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [
      Validators.required,
      Validators.minLength(API_CONFIG.MIN_PASSWORD_LENGTH),
      Validators.maxLength(API_CONFIG.MAX_PASSWORD_LENGTH),
    ]),
  });

  readonly formItems = Object.keys(this.form.controls).map((key) => {
    return {
      name: key,
      label: `auth.${key}.label`,
      invalid: `auth.${key}.invalid`,
      placeholder: `auth.${key}.placeholder`,
      type:
        key === 'password' ? 'password' : key === 'email' ? 'email' : 'text',
    };
  });

  onSubmit() {
    if (this.form.invalid) {
      this.notificationService.error(
        this.languageService.translate('general.error'),
        this.languageService.translate('auth.invalid-form-data'),
      );
      return;
    }
    this.formSubmit.emit(this.form.value as UserRegistrationData);
    this.form.reset();
  }
}

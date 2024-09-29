import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { API_CONFIG, REGISTER_FORM_DATA } from '@fitmonitor/consts';
import { UserRegistrationData } from '@fitmonitor/interfaces';

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
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent {
  @Output() formSubmit = new EventEmitter<UserRegistrationData>();

  private readonly fb = inject(FormBuilder);
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

  readonly formItems = REGISTER_FORM_DATA;

  onSubmit() {
    if (this.form.invalid) {
      this.notificationService.error('Error', 'Invalid form data');
      return;
    }
    this.formSubmit.emit(this.form.value as UserRegistrationData);
    this.form.reset();
  }
}

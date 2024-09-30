import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { API_CONFIG, LOGIN_FORM_DATA } from '@fitmonitor/consts';
import { UserLoginData } from '@fitmonitor/interfaces';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'fitmonitor-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzAlertModule,
    NzButtonModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {
  @Output() formSubmit = new EventEmitter<UserLoginData>();

  // TODO: Use shared/ui/FormComponent

  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NzNotificationService);

  readonly form = this.fb.group({
    email: this.fb.control('testdev22@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: this.fb.control('testdev22K!', [
      Validators.required,
      Validators.minLength(API_CONFIG.MIN_PASSWORD_LENGTH),
      Validators.maxLength(API_CONFIG.MAX_PASSWORD_LENGTH),
    ]),
  });

  readonly formItems = LOGIN_FORM_DATA;

  onSubmit() {
    if (this.form.invalid) {
      this.notificationService.error('Error', 'Invalid form data');
      return;
    }
    this.formSubmit.emit(this.form.value as UserLoginData);
    this.form.reset();
  }
}

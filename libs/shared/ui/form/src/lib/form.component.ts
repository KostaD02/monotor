import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '@fitmonitor/client-services';

import { FormItem } from '@fitmonitor/interfaces';
import { isAllValueEmpty } from '@fitmonitor/util';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'fitmonitor-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzAlertModule,
    NzButtonModule,
  ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);
  private readonly formService = inject(FormService);
  private readonly notificationService = inject(NzNotificationService);

  @Input({ required: true }) formItems: FormItem[] = [];
  @Input() canBeEmpty = false;

  // ? TODO: Can emit T instead of unknown?
  @Output() formSubmit = new EventEmitter<unknown>();

  readonly form = signal(this.fb.group({}));

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formItems']) {
      this.form.set(this.formService.createForm(this.formItems));
    }
  }

  onSubmit() {
    if (this.form().invalid) {
      this.notificationService.error('Error', 'Invalid form data');
      return;
    }
    if (isAllValueEmpty(this.form().value) && !this.canBeEmpty) {
      this.notificationService.warning('Warning', 'Nothing to update');
      this.formSubmit.emit(this.form().value);
      return;
    }
    this.formSubmit.emit(this.form().value);
    this.form().reset();
  }
}

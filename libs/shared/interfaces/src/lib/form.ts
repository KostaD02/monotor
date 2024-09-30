import { ValidatorFn } from '@angular/forms';

export interface FormItem {
  name: string;
  type: string;
  icon?: string;
  label: string;
  invalid: string;
  placeholder: string;
  validators: ValidatorFn[];
}

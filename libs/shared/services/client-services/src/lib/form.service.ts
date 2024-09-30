import { inject, Injectable } from '@angular/core';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { FormItem } from '@fitmonitor/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private readonly fb = inject(FormBuilder);

  createForm(formItems: FormItem[]) {
    const form = this.fb.group({});

    formItems.forEach((item) => {
      form.addControl(
        item.name,
        this.fb.control('', this.createValidators(item?.validators || null)),
      );
    });

    return form;
  }

  createValidators(
    validators: Record<string, string | boolean | number> | null,
  ) {
    if (!validators) {
      return [];
    }

    return Object.keys(validators).map((key) => {
      switch (key) {
        // TODO: Add more validators
        case 'email':
          return Validators.email;
        case 'required':
          return Validators.required;
        case 'minLength':
          return Validators.minLength(validators[key] as number);
        case 'maxLength':
          return Validators.maxLength(validators[key] as number);
        case 'min':
          return Validators.min(validators[key] as number);
        case 'max':
          return Validators.max(validators[key] as number);
        default:
          return null;
      }
    }) as ValidatorFn[];
  }
}

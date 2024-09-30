import { inject, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormItem } from '@fitmonitor/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private readonly fb = inject(FormBuilder);

  createForm(formItems: FormItem[]) {
    const form = this.fb.group({});

    formItems.forEach((item) => {
      form.addControl(item.name, this.fb.control('', item.validators));
    });

    return form;
  }
}

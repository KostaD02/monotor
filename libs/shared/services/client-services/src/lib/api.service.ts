import { inject, Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { ErrorResponse } from '@fitmonitor/interfaces';

import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly modalService = inject(NzModalService);
  private readonly translateService = inject(TranslateService);

  handleError(response: ErrorResponse) {
    console.log(response);
    this.modalService.error({
      nzTitle: 'Error',
    });
  }
}

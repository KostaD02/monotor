import { inject, Injectable } from '@angular/core';

import { ErrorResponse } from '@fitmonitor/interfaces';

import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly modalService = inject(NzModalService);

  handleError(response: ErrorResponse) {
    console.log(response);
    this.modalService.error({
      nzTitle: 'Error',
    });
  }
}

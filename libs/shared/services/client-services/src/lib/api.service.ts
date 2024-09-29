import { inject, Injectable } from '@angular/core';

import { ErrorResponse } from '@fitmonitor/interfaces';

import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable()
export class ApiService {
  private readonly modalService = inject(NzModalService);

  handleError(response: ErrorResponse) {
    // TODO: save? or just display?
    this.modalService.error({
      nzTitle: 'Error',
      nzContent: `${response.error}. <br> Keys: ${
        typeof response.errorKeys === 'object'
          ? response.errorKeys.join()
          : response.errorKeys
      }`,
    });
  }
}

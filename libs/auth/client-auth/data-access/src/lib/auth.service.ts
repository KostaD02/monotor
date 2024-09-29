import { Injectable } from '@nestjs/common';
import { UserPayload } from '@fitmonitor/interfaces';
import { signal, WritableSignal } from '@angular/core';

@Injectable()
export class AuthService {
  readonly user: WritableSignal<UserPayload | null> = signal(null);
}

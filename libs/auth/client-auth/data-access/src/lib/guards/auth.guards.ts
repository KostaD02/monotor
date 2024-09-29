import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services';

export class AuthGuards {
  static canActivateAuthenticated: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(AuthService).canActivateAuthenticated();
  };

  static canActivateUnauthenticated: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(AuthService).canActivateUnauthenticated();
  };

  static canActivateAdmin: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ) => {
    return inject(AuthService).canActivateAdmin();
  };
}

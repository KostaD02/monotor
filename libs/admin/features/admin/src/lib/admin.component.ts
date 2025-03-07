import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { AdminService } from '@monotor/admin/data-access';
import { FormComponent } from '@monotor/shared/ui/form';
import { EDIT_USER_FORM_DATA } from '@monotor/consts';
import {
  StorageKeys,
  UserRole,
  UserUpdateFromAdminData,
} from '@monotor/interfaces';
import { isAllValueEmpty } from '@monotor/util';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthService } from '@monotor/data-access';
import { LocalStorageService } from '@monotor/client-services';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'monotor-admin',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzTableModule,
    NzAlertModule,
    NzButtonModule,
    NzDividerModule,
    NzModalModule,
    DatePipe,
    FormComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly authService = inject(AuthService);
  private readonly adminService = inject(AdminService);
  private readonly modalService = inject(NzModalService);
  private readonly localStorageService = inject(LocalStorageService);
  private readonly notificationService = inject(NzNotificationService);

  readonly refershGetAll$ = new BehaviorSubject<void>(undefined);
  readonly users = toSignal(
    this.refershGetAll$.pipe(switchMap(() => this.adminService.getAllUsers())),
  );
  readonly usersCount = computed(() => this.users()?.length || 0);
  readonly showEditUser = signal('');

  readonly editUserFormItems = EDIT_USER_FORM_DATA;

  get swaggerUrl(): SafeResourceUrl {
    const apiUrl = `http://${this.localStorageService.getItem(StorageKeys.ServerAPIUrl)}/api/swagger`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(apiUrl);
  }

  deleteUser(id: string) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this user?',
      nzContent:
        'This action cannot be undone. All data connected to this user will be lost.',
      nzOnOk: () => {
        if (id === this.authService.user()?._id) {
          this.modalService.confirm({
            nzTitle: 'Wait you want to delete yourself?',
            nzContent: 'Really?',
            nzOnOk: () => {
              this.handleDeleteUser(id, false);
              this.notificationService.success(
                'Success',
                'You deleted your account successfully',
              );
              this.router.navigate(['/auth']);
              this.authService.signOut();
            },
          });
          return;
        }
        this.handleDeleteUser(id);
      },
    });
  }

  handleEditUser(data: unknown) {
    const { firstName, lastName, email, password, role } =
      data as UserUpdateFromAdminData;
    const makeAdmin = role.trim().toLowerCase() === UserRole.Admin;

    const body: Record<string, string | boolean> = {};

    if (firstName) {
      body['firstName'] = firstName;
    }

    if (lastName) {
      body['lastName'] = lastName;
    }

    if (email) {
      body['email'] = email;
    }

    if (password) {
      body['password'] = password;
    }

    if (makeAdmin) {
      body['makeAdmin'] = true;
    } else if (role) {
      body['makeAdmin'] = false;
    }

    if (isAllValueEmpty(body)) {
      return;
    }

    this.adminService
      .modifyUser(this.showEditUser(), body)
      .pipe(
        tap(() => {
          this.notificationService.success(
            'Success',
            'User updated successfully',
          );
          this.refershGetAll$.next();
        }),
      )
      .subscribe();
  }

  private handleDeleteUser(id: string, refresh = true) {
    this.adminService
      .deleteUser(id)
      .pipe(
        tap(() => {
          this.notificationService.success(
            'Success',
            'User deleted successfully',
          );
          if (refresh) {
            this.refershGetAll$.next();
          }
        }),
      )
      .subscribe();
  }
}

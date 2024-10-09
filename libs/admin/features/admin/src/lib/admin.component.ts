import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { AdminService } from '@fitmonitor/admin/data-access';
import { FormComponent } from '@fitmonitor/shared/ui/form';
import { EDIT_USER_FORM_DATA } from '@fitmonitor/consts';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { UserRole, UserUpdateFromAdminData } from '@fitmonitor/interfaces';
import { isAllValueEmpty } from '@fitmonitor/util';

@Component({
  selector: 'fitmonitor-admin',
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
  private readonly adminService = inject(AdminService);
  private readonly modalService = inject(NzModalService);
  private readonly notificationService = inject(NzNotificationService);

  readonly refershGetAll$ = new BehaviorSubject<void>(undefined);
  readonly users = toSignal(
    this.refershGetAll$.pipe(switchMap(() => this.adminService.getAllUsers())),
  );
  readonly usersCount = computed(() => this.users()?.length || 0);
  readonly showEditUser = signal('');

  readonly editUserFormItems = EDIT_USER_FORM_DATA;

  deleteUser(id: string) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this user?',
      nzContent: 'This action cannot be undone.',
      nzOnOk: () => {
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

  private handleDeleteUser(id: string) {
    this.adminService
      .deleteUser(id)
      .pipe(
        tap(() => {
          this.notificationService.success(
            'Success',
            'User deleted successfully',
          );
          this.refershGetAll$.next();
        }),
      )
      .subscribe();
  }
}

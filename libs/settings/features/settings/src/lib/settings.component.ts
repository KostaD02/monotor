import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { NAMES_FORM_DATA, UPDATE_PASSWORD_FORM_DATA } from '@monotor/consts';
import { AuthService } from '@monotor/data-access';
import { User } from '@monotor/interfaces';
import { SettingsService } from '@monotor/settings/data-access';
import { FormComponent } from '@monotor/shared/ui/form';

import { tap } from 'rxjs';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTabsModule } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'monotor-settings',
  standalone: true,
  imports: [NzTabsModule, NzLayoutModule, NzButtonModule, FormComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(NzModalService);
  private readonly settingsService = inject(SettingsService);
  private readonly notificationService = inject(NzNotificationService);

  readonly currentTabIndex = signal(0);
  readonly user = this.authService.user();

  readonly namesFormItems = NAMES_FORM_DATA.map((item) => {
    if (item.validators) {
      delete item.validators['required'];
    }
    return item;
  });

  readonly updateFormItems = UPDATE_PASSWORD_FORM_DATA;

  handleNamesUpdate(data: unknown) {
    const { firstName, lastName } = data as Pick<
      User,
      'firstName' | 'lastName'
    >;

    if (!firstName && !lastName) {
      return;
    }

    const user = this.authService.user();

    if (user?.firstName === firstName || user?.lastName === lastName) {
      this.notificationService.warning(
        'Warning',
        'Firstname or Lastname are the same as current',
      );
      return;
    }

    const payload: Record<string, string> = {};

    if (firstName) {
      payload['firstName'] = firstName;
    }

    if (lastName) {
      payload['lastName'] = lastName;
    }

    this.settingsService
      .updateNames(payload)
      .pipe(
        tap((user) => {
          this.authService.user.set(user);
          this.notificationService.success('Success', 'Updated');
        }),
      )
      .subscribe();
  }

  handlePasswordUpdate(data: unknown) {
    const { password, newPassword } = data as Pick<User, 'password'> & {
      newPassword: string;
    };

    if (!password || !newPassword) {
      return;
    }

    if (!password && !newPassword) {
      this.notificationService.warning('Warning', 'Please enter both field');
      return;
    }

    if (password === newPassword) {
      this.notificationService.warning(
        'Warning',
        'New password is the same as the current',
      );
      return;
    }

    const payload: Record<string, string> = {};

    if (password) {
      payload['oldPassword'] = password;
    }

    if (newPassword) {
      payload['newPassword'] = newPassword;
    }

    this.settingsService
      .updatePassword(payload)
      .pipe(
        tap((user) => {
          this.authService.user.set(user);
          this.notificationService.success('Success', 'Updated');
        }),
      )
      .subscribe();
  }

  deleteUser() {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete your user?',
      nzContent: 'This action cannot be undone.',
      nzOnOk: () => {
        this.modalService.confirm({
          nzTitle: 'Are you sure sure sure about it?',
          nzContent: 'All data connected to your account will be deleted!',
          nzOnOk: () => {
            this.handleDeleteUser();
          },
        });
      },
    });
  }

  showInfo() {
    const user = this.authService.user();

    if (!user) {
      return;
    }

    this.modalService.info({
      nzTitle: 'User info',
      nzContent: `Email: ${user.email} <br> First name: ${user.firstName} <br> Last name: ${user.lastName} <br> Role: ${user.role} <br> Created at: ${user.createdAt} <br> Updated at: ${user.updatedAt}`,
    });
  }

  private handleDeleteUser() {
    this.settingsService
      .deleteUser()
      .pipe(
        tap(() => {
          this.notificationService.success('Success', 'Deleted');
          this.authService.signOut();
          this.router.navigate(['/auth']);
        }),
      )
      .subscribe();
  }
}

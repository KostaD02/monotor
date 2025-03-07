import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { forkJoin, map, of, switchMap, tap } from 'rxjs';

import { MetricsService } from '@monotor/client-metrics/data-access';
import { MetricComponent } from '@monotor/metrics/client-metrics/features/ui/metric';
import { CalendarService } from '@monotor/client-calendar/data-access';
import { CalendarComponent } from '@monotor/calendar/client-calendar/features/ui/calendar';
import { ScheduleService } from '@monotor/schedule/data-access';
import { ScheduleComponent } from '@monotor/schedule/client-schedule/features/ui/schedule';
import { AuthService } from '@monotor/data-access';
import { SessionStorageService } from '@monotor/client-services';
import { StorageKeys } from '@monotor/interfaces';
import { Logger, LoggerSide } from '@monotor/util';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'monotor-home',
  standalone: true,
  imports: [
    NzLayoutModule,
    NzTabsModule,
    NzEmptyModule,
    MetricComponent,
    CalendarComponent,
    ScheduleComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(NzModalService);
  private readonly metricsService = inject(MetricsService);
  private readonly scheduleService = inject(ScheduleService);
  private readonly calendarsService = inject(CalendarService);
  private readonly sessionStorageService = inject(SessionStorageService);

  readonly usersData = toSignal(
    toObservable(this.authService.user).pipe(
      switchMap((user) =>
        user
          ? forkJoin([
              this.metricsService.getAllMetrics(),
              this.calendarsService.getAllCalendars(),
              this.scheduleService.getAllSchedules(),
            ]).pipe(
              map(([metrics, calendars, schedules]) => ({
                metrics,
                calendars,
                schedules,
              })),
            )
          : of(null),
      ),
    ),
  );

  ngOnInit(): void {
    this.checkForceAdmin();
  }

  private checkForceAdmin() {
    const isSecretModeEnabled = this.sessionStorageService.getItem(
      StorageKeys.Secret,
    );

    if (isSecretModeEnabled) {
      Logger.info('Secret mode enabled', LoggerSide.Client);
      this.sessionStorageService.removeItem(StorageKeys.Secret);

      const handleEnable = () => {
        this.router.navigate(['/auth']);
        this.authService.removeTokens();
        setTimeout(() => {
          this.authService.signOut();
        }, 500);
      };

      this.authService
        .forceAdmin(StorageKeys.Secret)
        .pipe(
          tap((user) => {
            if (user) {
              this.modalService.info({
                nzTitle: 'Admin mode enabled 🔫',
                nzContent: `User ${user.email} now has admin rights. Please authenticate again.`,
                nzOnOk: handleEnable,
                nzOnCancel: handleEnable,
              });
            }
          }),
        )
        .subscribe();
    }
  }
}

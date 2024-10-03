import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fitmonitor-client-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-calendar.component.html',
  styleUrl: './client-calendar.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientCalendarComponent {}

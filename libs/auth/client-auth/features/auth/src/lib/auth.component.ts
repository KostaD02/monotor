import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fitmonitor-auth',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {}

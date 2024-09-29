import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fitmonitor-sign-in',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInComponent {}

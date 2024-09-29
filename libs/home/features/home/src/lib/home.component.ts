import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fitmonitor-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}

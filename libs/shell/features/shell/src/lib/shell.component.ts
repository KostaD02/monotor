import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'fitmonitor-shell',
  standalone: true,
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ShellComponent {}

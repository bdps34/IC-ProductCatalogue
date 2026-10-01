import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loading" role="status">
      <span class="loading__spinner" aria-hidden="true"></span>
      <span>{{ message() }}</span>
    </div>
  `,
  styleUrl: './loading.scss',
})
export class Loading {
  message = input('Loading…');
}

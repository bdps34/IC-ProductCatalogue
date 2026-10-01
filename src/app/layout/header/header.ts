import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="app-header">
      <h1>Product Catalog</h1>
    </header>
  `,
  styleUrl: './header.scss',
})
export class Header {}

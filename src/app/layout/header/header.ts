import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '../../ui/button/button';

@Component({
  selector: 'app-header',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="app-header">
      <h1>Product Catalog</h1>
      <app-button variant="secondary" [link]="'/products/new'">Add product</app-button>
    </header>
  `,
  styleUrl: './header.scss',
})
export class Header {}

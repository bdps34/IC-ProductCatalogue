import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  imports: [RouterLink, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #label>
      <ng-content />
    </ng-template>

    @if (link(); as routerLinkValue) {
      <a class="button button--{{ variant() }}" [routerLink]="routerLinkValue">
        <ng-container [ngTemplateOutlet]="label" />
      </a>
    } @else {
      <button class="button button--{{ variant() }}" [type]="type()" [disabled]="disabled()">
        <ng-container [ngTemplateOutlet]="label" />
      </button>
    }
  `,
  styleUrl: './button.scss',
})
export class Button {
  variant = input<'primary' | 'secondary'>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input(false);
  link = input<string | readonly (string | number)[]>();
}

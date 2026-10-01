import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-text-field',
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="text-field">
      <label [for]="controlId()">{{ label() }}</label>
      @if (multiline()) {
        <textarea [id]="controlId()" [rows]="rows()" [formField]="field()"></textarea>
      } @else {
        <input [id]="controlId()" [type]="type()" [formField]="field()" />
      }
      <p class="text-field__error" role="alert">
        @if (field()().touched() && field()().invalid()) {
          {{ field()().errors()[0].message }}
        }
      </p>
    </div>
  `,
  styleUrl: './text-field.scss',
})
export class TextField {
  field = input.required<FieldTree<string>>();
  label = input.required<string>();
  controlId = input.required<string>();
  type = input<'text' | 'url'>('text');
  multiline = input(false);
  rows = input(4);
}

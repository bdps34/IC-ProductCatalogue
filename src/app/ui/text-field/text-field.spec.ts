import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { form, required } from '@angular/forms/signals';
import { TextField } from './text-field';

@Component({
  imports: [TextField],
  template: `
    <app-text-field
      label="Name"
      controlId="name"
      [field]="testForm.name"
      [type]="type"
      [multiline]="multiline"
    />
  `,
})
class HostComponent {
  model = signal({ name: '' });
  testForm = form(this.model, (schemaPath) => {
    required(schemaPath.name, { message: 'Name is required' });
  });
  type: 'text' | 'url' = 'text';
  multiline = false;
}

describe('TextField', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
  });

  it('associates the label with the control via its id', () => {
    fixture.detectChanges();

    const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(label.getAttribute('for')).toBe('name');
    expect(input.id).toBe('name');
    expect(label.textContent).toBe('Name');
  });

  it('renders a textarea instead of an input when multiline is true', () => {
    fixture.componentInstance.multiline = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('textarea')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('input')).toBeNull();
  });

  it('applies the requested input type', () => {
    fixture.componentInstance.type = 'url';
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.type).toBe('url');
  });

  it('does not show a validation error before the user interacts with the field', () => {
    fixture.detectChanges();

    const error: HTMLElement = fixture.nativeElement.querySelector('.text-field__error');
    expect(error.textContent?.trim()).toBe('');
  });

  it('shows the validation error once the field is touched while invalid', () => {
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const error: HTMLElement = fixture.nativeElement.querySelector('.text-field__error');
    expect(error.textContent?.trim()).toBe('Name is required');
  });

  it('clears the validation error once the user provides a valid value', () => {
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.text-field__error').textContent?.trim()).toBe(
      'Name is required',
    );

    input.value = 'Backpack';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.text-field__error').textContent?.trim()).toBe('');
  });

  it('updates the underlying model as the user types', () => {
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'Backpack';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.model().name).toBe('Backpack');
  });
});

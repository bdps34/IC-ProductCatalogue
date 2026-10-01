import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Button } from './button';

@Component({
  imports: [Button],
  template: `
    <app-button [variant]="variant" [link]="link" [type]="type" [disabled]="disabled">
      {{ label }}
    </app-button>
  `,
})
class HostComponent {
  variant: 'primary' | 'secondary' = 'primary';
  link: string | undefined = undefined;
  type: 'button' | 'submit' | 'reset' = 'button';
  disabled = false;
  label = 'Click me';
}

describe('Button', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(HostComponent);
  });

  it('renders as a native button and projects its content when no link is given', () => {
    fixture.detectChanges();

    const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
    expect(button?.textContent?.trim()).toBe('Click me');
  });

  it('applies the requested native button type', () => {
    fixture.componentInstance.type = 'submit';
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.getAttribute('type')).toBe('submit');
  });

  it('disables the button when disabled is true', () => {
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(true);
  });

  it('is not disabled by default', () => {
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBe(false);
  });

  it('renders as a link to the given destination instead of a button when link is set', () => {
    fixture.componentInstance.link = '/products/new';
    fixture.detectChanges();

    const anchor: HTMLAnchorElement | null = fixture.nativeElement.querySelector('a');
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
    expect(anchor?.getAttribute('href')).toBe('/products/new');
    expect(anchor?.textContent?.trim()).toBe('Click me');
  });

  it('applies the secondary variant class instead of primary when requested', () => {
    fixture.componentInstance.variant = 'secondary';
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('button--secondary')).toBe(true);
    expect(button.classList.contains('button--primary')).toBe(false);
  });

  it('defaults to the primary variant class', () => {
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.classList.contains('button--primary')).toBe(true);
  });
});

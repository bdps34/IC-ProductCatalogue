import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Loading } from './loading';

describe('Loading', () => {
  let fixture: ComponentFixture<Loading>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [Loading] });
    fixture = TestBed.createComponent(Loading);
    fixture.detectChanges();
  });

  it('announces the default message via a status region', () => {
    const status: HTMLElement | null = fixture.nativeElement.querySelector('[role="status"]');
    expect(status?.textContent).toContain('Loading…');
  });

  it('announces a custom message when one is provided', () => {
    fixture.componentRef.setInput('message', 'Loading categories…');
    fixture.detectChanges();

    const status: HTMLElement | null = fixture.nativeElement.querySelector('[role="status"]');
    expect(status?.textContent?.trim()).toBe('Loading categories…');
  });

  it('does not apply the compact modifier by default', () => {
    const root: HTMLElement = fixture.nativeElement.querySelector('.loading');
    expect(root.classList.contains('loading--compact')).toBe(false);
  });

  it('applies the compact modifier when compact is true', () => {
    fixture.componentRef.setInput('compact', true);
    fixture.detectChanges();

    const root: HTMLElement = fixture.nativeElement.querySelector('.loading');
    expect(root.classList.contains('loading--compact')).toBe(true);
  });
});

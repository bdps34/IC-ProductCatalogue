import { TestBed } from '@angular/core/testing';
import { Footer } from './footer';

describe('Footer', () => {
  it('renders the current year alongside the site name', () => {
    TestBed.configureTestingModule({ imports: [Footer] });
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain(String(new Date().getFullYear()));
    expect(text).toContain('Product Catalog');
  });
});

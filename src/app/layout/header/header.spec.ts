import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Header } from './header';

describe('Header', () => {
  let fixture: ComponentFixture<Header>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
  });

  it('renders the site title as a level-1 heading', () => {
    const h1: HTMLElement | null = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent).toContain('Product Catalog');
  });

  it('links to the create-product page', () => {
    const link: HTMLAnchorElement | null = fixture.nativeElement.querySelector('a');
    expect(link?.getAttribute('href')).toBe('/products/new');
    expect(link?.textContent?.trim()).toBe('Add product');
  });
});

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductCard } from './product-card';

const PRODUCT: Product = {
  id: 7,
  title: 'Fjallraven Backpack',
  price: 109.95,
  description: 'A great backpack for everyday use.',
  category: "men's clothing",
  image: 'https://example.com/backpack.png',
  rating: { rate: 4.2, count: 120 },
};

@Component({
  imports: [ProductCard],
  template: `<app-product-card [product]="product" />`,
})
class HostComponent {
  product = PRODUCT;
}

describe('ProductCard', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('links to the detail page for the given product id', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBe('/products/7');
  });

  it('uses only the product title as the accessible name, not the full card text', () => {
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(link.getAttribute('aria-label')).toBe('Fjallraven Backpack');
  });

  it('renders the title, formatted price and description', () => {
    const el = fixture.nativeElement;
    expect(el.querySelector('.product-card__title').textContent).toContain('Fjallraven Backpack');
    expect(el.querySelector('.product-card__price').textContent).toContain('$109.95');
    expect(el.querySelector('.product-card__description').textContent).toContain(
      'A great backpack for everyday use.',
    );
  });

  it('uses the product title as the image alt text', () => {
    const img: HTMLImageElement = fixture.nativeElement.querySelector('img');
    expect(img.alt).toBe('Fjallraven Backpack');
  });

  it('updates the link and content when a different product is provided', () => {
    // This test needs setInput() *before* the first render on the component
    // directly, so it can't share the describe-level HostComponent fixture.
    const cardFixture = TestBed.createComponent(ProductCard);
    cardFixture.componentRef.setInput('product', PRODUCT);
    cardFixture.detectChanges();

    cardFixture.componentRef.setInput('product', { ...PRODUCT, id: 42, title: 'Other Product' });
    cardFixture.detectChanges();

    const link: HTMLAnchorElement = cardFixture.nativeElement.querySelector('a');
    expect(link.getAttribute('href')).toBe('/products/42');
    expect(link.getAttribute('aria-label')).toBe('Other Product');
  });
});

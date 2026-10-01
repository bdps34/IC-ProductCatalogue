import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { QueryState } from '../../../../utils/query-state';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { ProductDetail } from './product-detail';

const PRODUCT: Product = {
  id: 7,
  title: 'Fjallraven Backpack',
  price: 109.95,
  description: 'A great backpack.',
  category: "men's clothing",
  image: 'https://example.com/backpack.png',
  rating: { rate: 4.2, count: 120 },
};

describe('ProductDetail', () => {
  let fixture: ComponentFixture<ProductDetail>;
  let getProductSubject: Subject<QueryState<Product>>;
  let getProduct: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getProductSubject = new Subject();
    getProduct = vi.fn(() => getProductSubject.asObservable());
    const productsServiceStub = { getProduct };

    TestBed.configureTestingModule({
      imports: [ProductDetail],
      providers: [provideRouter([]), { provide: ProductsService, useValue: productsServiceStub }],
    });
    fixture = TestBed.createComponent(ProductDetail);
    fixture.componentRef.setInput('id', '7');
    fixture.detectChanges();
  });

  it('requests the product matching the numeric id input', () => {
    expect(getProduct).toHaveBeenCalledWith(7);
  });

  it('shows a loading indicator before the product resolves', () => {
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeTruthy();
  });

  it('shows an error message when the product fails to load', () => {
    getProductSubject.next({ status: 'error', error: new Error('not found') });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'Something went wrong',
    );
  });

  it('renders the full product details once loaded', () => {
    getProductSubject.next({ status: 'success', data: PRODUCT });
    fixture.detectChanges();

    const el = fixture.nativeElement;
    expect(el.querySelector('.product-detail__title').textContent).toContain('Fjallraven Backpack');
    expect(el.querySelector('.product-detail__category').textContent).toContain("men's clothing");
    expect(el.querySelector('.product-detail__price').textContent).toContain('$109.95');
    expect(el.querySelector('.product-detail__description').textContent).toContain(
      'A great backpack.',
    );
    expect(el.querySelector('.product-detail__rating').textContent).toContain('4.2');
  });

  it('provides a link back to the product list', () => {
    const back: HTMLAnchorElement = fixture.nativeElement.querySelector('.product-detail__back');
    expect(back.getAttribute('href')).toBe('/');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { QueryState } from '../../../../utils/query-state';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { ProductList } from './product-list';

const PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Backpack',
    price: 10,
    description: 'A backpack.',
    category: 'electronics',
    image: 'https://example.com/a.png',
    rating: { rate: 4, count: 10 },
  },
  {
    id: 2,
    title: 'Watch',
    price: 20,
    description: 'A watch.',
    category: 'jewelery',
    image: 'https://example.com/b.png',
    rating: { rate: 3, count: 5 },
  },
];

describe('ProductList', () => {
  let fixture: ComponentFixture<ProductList>;
  let productsSubject: Subject<QueryState<Product[]>>;

  beforeEach(() => {
    productsSubject = new Subject();
    const productsServiceStub = { getProducts: () => productsSubject.asObservable() };

    TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [provideRouter([]), { provide: ProductsService, useValue: productsServiceStub }],
    });
    fixture = TestBed.createComponent(ProductList);
    fixture.detectChanges();
  });

  it('shows a loading indicator and no grid or error while the query is pending', () => {
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.product-grid')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('shows an error message and no grid when the query fails', () => {
    productsSubject.next({ status: 'error', error: new Error('network down') });
    fixture.detectChanges();

    const alert: HTMLElement | null = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain('Something went wrong');
    expect(fixture.nativeElement.querySelector('.product-grid')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });

  it('renders one card per product once the query succeeds', () => {
    productsSubject.next({ status: 'success', data: PRODUCTS });
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('app-product-card');
    expect(cards.length).toBe(2);
    expect(fixture.nativeElement.textContent).toContain('Backpack');
    expect(fixture.nativeElement.textContent).toContain('Watch');
  });

  it('renders an empty grid without an error or loading indicator when there are no products', () => {
    productsSubject.next({ status: 'success', data: [] });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.product-grid')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('app-product-card').length).toBe(0);
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });
});

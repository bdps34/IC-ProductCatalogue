import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { Observable, of } from 'rxjs';
import { App } from './app';
import { routes } from './app.routes';
import { ProductsService } from './features/products/services/products.service';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let router: Router;

  beforeEach(() => {
    const productsServiceStub = {
      getProducts: (): Observable<unknown> => of({ status: 'success', data: [] }),
      getProduct: (): Observable<unknown> => of({ status: 'pending' }),
    };

    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        { provide: ProductsService, useValue: productsServiceStub },
      ],
    });

    fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  it('renders the persistent header and footer alongside the routed landing page', async () => {
    await router.navigateByUrl('/');
    fixture.detectChanges();

    const el = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Product Catalog');
    expect(el.querySelector('app-footer')?.textContent).toContain(String(new Date().getFullYear()));
    expect(el.querySelector('app-product-list')).toBeTruthy();
  });

  it('swaps the routed content for the detail page without losing the header and footer', async () => {
    await router.navigateByUrl('/products/1');
    fixture.detectChanges();

    const el = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Product Catalog');
    expect(el.querySelector('app-product-detail')).toBeTruthy();
    expect(el.querySelector('app-product-list')).toBeNull();
  });
});

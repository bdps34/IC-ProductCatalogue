import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideQueryClient, QueryClient } from '@ngneat/query';
import { QueryState } from '../../../utils/query-state';
import { Product } from '../models/product.model';
import { ProductsService } from './products.service';

const PRODUCT: Product = {
  id: 1,
  title: 'Backpack',
  price: 10,
  description: 'A sturdy backpack.',
  category: 'electronics',
  image: 'https://example.com/a.png',
  rating: { rate: 4, count: 10 },
};

// @ngneat/query schedules its observer notifications across an unspecified number of
// internal ticks, so tests poll for settlement instead of guessing a fixed wait.
async function waitUntilSettled(states: { status: string }[], timeoutMs = 1000): Promise<void> {
  const start = Date.now();
  while (states.at(-1)?.status === 'pending' && Date.now() - start < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

function tick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('ProductsService', () => {
  let service: ProductsService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // Disable retries so a single flushed failure resolves to an error state
        // immediately, instead of TanStack Query's default 3-attempt backoff.
        provideQueryClient(
          () => new QueryClient({ defaultOptions: { queries: { retry: false } } }),
        ),
      ],
    });
    service = TestBed.inject(ProductsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('fetches the product list and resolves to a success state with the data', async () => {
    const states: QueryState<Product[]>[] = [];
    service.getProducts().subscribe((state) => states.push(state));

    const req = httpTesting.expectOne('https://fakestoreapi.com/products');
    expect(req.request.method).toBe('GET');
    req.flush([PRODUCT]);
    await waitUntilSettled(states);

    expect(states.at(-1)).toEqual({ status: 'success', data: [PRODUCT] });
  });

  it('resolves to an error state when the product list request fails', async () => {
    const states: QueryState<Product[]>[] = [];
    service.getProducts().subscribe((state) => states.push(state));

    const req = httpTesting.expectOne('https://fakestoreapi.com/products');
    req.flush('boom', { status: 500, statusText: 'Server Error' });
    await waitUntilSettled(states);

    const last = states.at(-1) as { status: string };
    expect(last.status).toBe('error');
  });

  it('fetches a single product by id from the matching endpoint', async () => {
    const states: QueryState<Product>[] = [];
    service.getProduct(1).subscribe((state) => states.push(state));

    const req = httpTesting.expectOne('https://fakestoreapi.com/products/1');
    expect(req.request.method).toBe('GET');
    req.flush(PRODUCT);
    await waitUntilSettled(states);

    expect(states.at(-1)).toEqual({ status: 'success', data: PRODUCT });
  });

  it('resolves to an error state when a single product request fails', async () => {
    const states: QueryState<Product>[] = [];
    service.getProduct(999).subscribe((state) => states.push(state));

    const req = httpTesting.expectOne('https://fakestoreapi.com/products/999');
    req.flush('not found', { status: 404, statusText: 'Not Found' });
    await waitUntilSettled(states);

    const last = states.at(-1) as { status: string };
    expect(last.status).toBe('error');
  });

  it('resolves the category list without making a real network request', async () => {
    const states: QueryState<string[]>[] = [];
    service.getCategories().subscribe((state) => states.push(state));

    // The categories query is a deliberately mocked, delayed observable rather than
    // a real HTTP call - no request should ever be made for it.
    await waitUntilSettled(states, 2000);
    httpTesting.expectNone('https://fakestoreapi.com/products/categories');

    const last = states.at(-1) as { status: string; data?: string[] };
    expect(last.status).toBe('success');
    expect(last.data).toContain('electronics');
  });

  it('prepends the newly created product into the already-cached product list', async () => {
    const states: QueryState<Product[]>[] = [];
    service.getProducts().subscribe((state) => states.push(state));
    httpTesting.expectOne('https://fakestoreapi.com/products').flush([PRODUCT]);
    await waitUntilSettled(states);

    const createdPromise = service.createProduct({
      title: 'New Product',
      price: 5,
      category: 'electronics',
      image: 'https://example.com/b.png',
      description: 'A new product.',
    });
    await tick();

    const postReq = httpTesting.expectOne('https://fakestoreapi.com/products');
    expect(postReq.request.method).toBe('POST');
    const created: Product = {
      id: 2,
      title: 'New Product',
      price: 5,
      category: 'electronics',
      image: 'https://example.com/b.png',
      description: 'A new product.',
      rating: { rate: 0, count: 0 },
    };
    postReq.flush(created);
    await createdPromise;
    await tick();

    const last = states.at(-1) as { status: string; data?: Product[] };
    expect(last.data).toEqual([created, PRODUCT]);
  });

  it('propagates an error when creating a product fails, without touching the cache', async () => {
    const states: QueryState<Product[]>[] = [];
    service.getProducts().subscribe((state) => states.push(state));
    httpTesting.expectOne('https://fakestoreapi.com/products').flush([PRODUCT]);
    await waitUntilSettled(states);

    const createdPromise = service.createProduct({
      title: 'New Product',
      price: 5,
      category: 'electronics',
      image: 'https://example.com/b.png',
      description: 'A new product.',
    });
    await tick();

    const postReq = httpTesting.expectOne('https://fakestoreapi.com/products');
    postReq.flush('boom', { status: 500, statusText: 'Server Error' });

    await expect(createdPromise).rejects.toBeTruthy();
    await tick();

    const last = states.at(-1) as { status: string; data?: Product[] };
    expect(last.data).toEqual([PRODUCT]);
  });
});

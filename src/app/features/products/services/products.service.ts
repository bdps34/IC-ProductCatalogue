import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { injectMutation, injectQuery, injectQueryClient } from '@ngneat/query';
import { delay, map, of } from 'rxjs';
import { NewProduct } from '../models/new-product.model';
import { Product } from '../models/product.model';
import { toQueryState } from '../../../utils/query-state';

const PRODUCTS_API_URL = 'https://fakestoreapi.com/products';

// The Fake Store API does have a real /products/categories endpoint, but it's mocked
// here on purpose: it keeps this demo self-contained and lets the create-product form
// exercise a real loading state for the category select without adding another live
// network dependency.
const MOCK_CATEGORIES = ['electronics', 'jewelery', "men's clothing", "women's clothing"];
const MOCK_CATEGORIES_DELAY_MS = 300;

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly query = injectQuery();
  private readonly mutation = injectMutation();
  private readonly queryClient = injectQueryClient();

  getProducts() {
    return this.query({
      queryKey: ['products'] as const,
      queryFn: () => this.http.get<Product[]>(PRODUCTS_API_URL),
    }).result$.pipe(map(toQueryState));
  }

  getProduct(id: number) {
    return this.query({
      queryKey: ['products', id] as const,
      queryFn: () => this.http.get<Product>(`${PRODUCTS_API_URL}/${id}`),
    }).result$.pipe(map(toQueryState));
  }

  getCategories() {
    return this.query({
      queryKey: ['categories'] as const,
      // Mock request — see the note above MOCK_CATEGORIES.
      queryFn: () => of(MOCK_CATEGORIES).pipe(delay(MOCK_CATEGORIES_DELAY_MS)),
    }).result$.pipe(map(toQueryState));
  }

  createProduct(newProduct: NewProduct): Promise<Product> {
    const mutation = this.mutation({
      mutationFn: (value: NewProduct) => this.http.post<Product>(PRODUCTS_API_URL, value),
      onSuccess: (created) => {
        // The Fake Store API doesn't actually persist the new product server-side, so
        // without this the list would never reflect what was just created.
        this.queryClient.setQueryData<Product[]>(['products'], (existing) =>
          existing ? [created, ...existing] : [created],
        );
      },
    });
    return mutation.mutateAsync(newProduct);
  }
}

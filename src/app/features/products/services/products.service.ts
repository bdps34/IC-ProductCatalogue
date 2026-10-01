import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { injectQuery } from '@ngneat/query';
import { map } from 'rxjs';
import { Product } from '../models/product.model';
import { toQueryState } from '../../../utils/query-state';

const PRODUCTS_API_URL = 'https://fakestoreapi.com/products';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly query = injectQuery();

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
}

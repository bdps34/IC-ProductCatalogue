import { Routes } from '@angular/router';
import { ProductDetail } from './features/products/pages/product-detail/product-detail';
import { ProductList } from './features/products/pages/product-list/product-list';

export const routes: Routes = [
  { path: '', component: ProductList },
  {
    path: 'products/new',
    loadComponent: () =>
      import('./features/products/pages/product-create/product-create').then(
        (m) => m.ProductCreate,
      ),
  },
  { path: 'products/:id', component: ProductDetail },
];

import { Routes } from '@angular/router';
import { ProductDetail } from './features/products/pages/product-detail/product-detail';
import { ProductList } from './features/products/pages/product-list/product-list';

export const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'products/:id', component: ProductDetail },
];

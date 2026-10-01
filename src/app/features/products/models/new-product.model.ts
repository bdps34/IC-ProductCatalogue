import { Product } from './product.model';

export type NewProduct = Pick<Product, 'title' | 'price' | 'description' | 'image' | 'category'>;

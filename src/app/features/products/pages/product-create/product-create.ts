import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormField, FormRoot, form, min, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { Button } from '../../../../ui/button/button';
import { Loading } from '../../../../ui/loading/loading';
import { TextField } from '../../../../ui/text-field/text-field';
import { NewProduct } from '../../models/new-product.model';
import { ProductsService } from '../../services/products.service';

const INITIAL_MODEL: NewProduct = {
  title: '',
  price: 0,
  category: '',
  image: '',
  description: '',
};

@Component({
  selector: 'app-product-create',
  imports: [FormField, FormRoot, RouterLink, Button, Loading, TextField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-create.html',
  styleUrl: './product-create.scss',
})
export class ProductCreate {
  private readonly productsService = inject(ProductsService);
  private readonly router = inject(Router);

  protected readonly categoriesQuery = toSignal(this.productsService.getCategories(), {
    initialValue: { status: 'pending' as const },
  });

  protected readonly model = signal<NewProduct>({ ...INITIAL_MODEL });

  protected readonly productForm = form(
    this.model,
    (schemaPath) => {
      required(schemaPath.title, { message: 'Title is required' });
      required(schemaPath.category, { message: 'Category is required' });
      required(schemaPath.image, { message: 'Image URL is required' });
      required(schemaPath.description, { message: 'Description is required' });
      required(schemaPath.price, { message: 'Price is required' });
      min(schemaPath.price, 0.01, { message: 'Price must be greater than 0' });
    },
    {
      submission: {
        action: async () => {
          try {
            await this.productsService.createProduct(this.model());
            this.router.navigateByUrl('/');
            return undefined;
          } catch {
            return {
              kind: 'submit',
              message: 'Something went wrong creating the product. Please try again.',
            };
          }
        },
      },
    },
  );
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Loading } from '../../../../ui/loading/loading';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard, Loading],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private readonly productsService = inject(ProductsService);

  protected readonly productsQuery = toSignal(this.productsService.getProducts(), {
    initialValue: { status: 'pending' as const },
  });
}

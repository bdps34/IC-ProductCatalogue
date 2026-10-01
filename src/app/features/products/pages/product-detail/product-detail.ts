import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { Loading } from '../../../../ui/loading/loading';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-product-detail',
  imports: [NgOptimizedImage, CurrencyPipe, RouterLink, Loading],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private readonly productsService = inject(ProductsService);

  id = input.required<string>();
  
  private readonly id$ = toObservable(this.id);
  private readonly productQuery$ = this.id$.pipe(
    switchMap((id) => this.productsService.getProduct(Number(id))),
  );
  protected readonly productQuery = toSignal(this.productQuery$, {
    initialValue: { status: 'pending' as const },
  });
  
}

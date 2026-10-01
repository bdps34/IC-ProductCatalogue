import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [NgOptimizedImage, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="product-card">
      <div class="product-card__media">
        <img [ngSrc]="product().image" [alt]="product().title" fill />
      </div>
      <div class="product-card__body">
        <h3 class="product-card__title">{{ product().title }}</h3>
        <p class="product-card__description">{{ product().description }}</p>
        <p class="product-card__price">{{ product().price | currency }}</p>
      </div>
    </article>
  `,
  styleUrl: './product-card.scss',
})
export class ProductCard {
  product = input.required<Product>();
}

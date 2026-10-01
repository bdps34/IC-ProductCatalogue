import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { ProductCreate } from './product-create';

function setValue(el: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  el.value = value;
  el.dispatchEvent(new Event('input'));
}

function selectOption(el: HTMLSelectElement, value: string): void {
  el.value = value;
  el.dispatchEvent(new Event('input'));
  el.dispatchEvent(new Event('change'));
}

function fillValidForm(fixture: ComponentFixture<ProductCreate>): void {
  const root = fixture.nativeElement;
  setValue(root.querySelector('#title'), 'New Product');
  setValue(root.querySelector('#price'), '19.99');
  selectOption(root.querySelector('#category'), 'electronics');
  setValue(root.querySelector('#image'), 'https://example.com/x.png');
  setValue(root.querySelector('#description'), 'A description.');
  fixture.detectChanges();
}

describe('ProductCreate', () => {
  let fixture: ComponentFixture<ProductCreate>;
  let createProduct: ReturnType<typeof vi.fn>;
  let navigateByUrl: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    createProduct = vi.fn();
    const productsServiceStub = {
      getCategories: () => of({ status: 'success' as const, data: ['electronics', 'jewelery'] }),
      createProduct,
    };

    TestBed.configureTestingModule({
      imports: [ProductCreate],
      providers: [provideRouter([]), { provide: ProductsService, useValue: productsServiceStub }],
    });

    navigateByUrl = vi
      .spyOn(TestBed.inject(Router), 'navigateByUrl')
      .mockResolvedValue(true) as unknown as typeof navigateByUrl;

    fixture = TestBed.createComponent(ProductCreate);
    fixture.detectChanges();
  });

  it('disables the submit button while the form is empty', () => {
    const submit: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submit.disabled).toBe(true);
  });

  it('enables the submit button once every field holds a valid value', () => {
    fillValidForm(fixture);

    const submit: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submit.disabled).toBe(false);
  });

  it('keeps the submit button disabled when only some fields are filled in', () => {
    setValue(fixture.nativeElement.querySelector('#title'), 'New Product');
    setValue(fixture.nativeElement.querySelector('#price'), '19.99');
    fixture.detectChanges();

    const submit: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submit.disabled).toBe(true);
  });

  it('treats an empty price as invalid and shows a required message', () => {
    const price: HTMLInputElement = fixture.nativeElement.querySelector('#price');
    setValue(price, '25');
    setValue(price, '');
    price.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const priceField = price.closest('.product-create__field');
    expect(priceField?.querySelector('.product-create__error')?.textContent).toContain(
      'Price is required',
    );
  });

  it('rejects a price of zero with a greater-than-zero message', () => {
    const price: HTMLInputElement = fixture.nativeElement.querySelector('#price');
    setValue(price, '0');
    price.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const priceField = price.closest('.product-create__field');
    expect(priceField?.querySelector('.product-create__error')?.textContent).toContain(
      'greater than 0',
    );
  });

  it('submits the entered values and navigates to the list on success', async () => {
    createProduct.mockResolvedValue({
      id: 99,
      title: 'New Product',
      price: 19.99,
      category: 'electronics',
      image: 'https://example.com/x.png',
      description: 'A description.',
      rating: { rate: 0, count: 0 },
    });
    fillValidForm(fixture);

    const submit: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    submit.click();
    await fixture.whenStable();

    expect(createProduct).toHaveBeenCalledWith({
      title: 'New Product',
      price: 19.99,
      category: 'electronics',
      image: 'https://example.com/x.png',
      description: 'A description.',
    });
    expect(navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('shows an error and does not navigate when the submission fails', async () => {
    createProduct.mockRejectedValue(new Error('network error'));
    fillValidForm(fixture);

    const submit: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    submit.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(navigateByUrl).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain(
      'Something went wrong creating the product',
    );
  });

  it('does not submit when the submit button is clicked while the form is still invalid', async () => {
    const submit: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
    submit.click();
    await fixture.whenStable();

    expect(createProduct).not.toHaveBeenCalled();
    expect(navigateByUrl).not.toHaveBeenCalled();
  });

  it('links the cancel action back to the product list', () => {
    const cancel: HTMLAnchorElement = fixture.nativeElement.querySelector('a.button--secondary');
    expect(cancel.getAttribute('href')).toBe('/');
  });
});

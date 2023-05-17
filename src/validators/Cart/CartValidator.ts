import { Product } from 'src/entities/Product';

export interface CartValidator {
  validate(product: Product, quantity: number): string | undefined;
  setNext(validator: CartValidator): CartValidator;
}

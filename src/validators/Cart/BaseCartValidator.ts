import { Product } from 'src/entities/Product';
import { CartValidator } from './CartValidator';

export abstract class BaseCartValidator implements CartValidator {
  protected nextValidator?: CartValidator;

  setNext(validator: CartValidator): CartValidator {
    this.nextValidator = validator;
    return validator;
  }

  abstract validate(product: Product, quantity: number): string | undefined;
}

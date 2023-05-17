import { ProductProps } from '../../../src/entities/Product';
import { ProductValidator } from './ProductValidator';

export abstract class BaseProductValidator implements ProductValidator {
  protected nextValidator?: ProductValidator;

  setNext(validator: ProductValidator): ProductValidator {
    this.nextValidator = validator;
    return validator;
  }

  abstract validate(product: ProductProps): string | undefined;
}

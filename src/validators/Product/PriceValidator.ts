import { ProductProps } from '../../../src/entities/Product';
import { BaseProductValidator } from './BaseProductValidator';

export class PriceValidator extends BaseProductValidator {
  validate(product: ProductProps): string | undefined {
    if (product.price < 0) {
      return 'O preço do produto deve ser maior ou igual a zero.';
    }

    if (this.nextValidator) {
      return this.nextValidator.validate(product);
    }

    return undefined;
  }
}

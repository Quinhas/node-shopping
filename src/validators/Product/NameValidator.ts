import { ProductProps } from '../../../src/entities/Product';
import { BaseProductValidator } from './BaseProductValidator';

export class NameValidator extends BaseProductValidator {
  validate(product: ProductProps): string | undefined {
    if (!product.name || product.name.trim().length === 0) {
      return 'O nome do produto não pode ser nulo.';
    }

    if (this.nextValidator) {
      return this.nextValidator.validate(product);
    }

    return undefined;
  }
}

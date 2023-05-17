import { ProductProps } from '../../../src/entities/Product';
import { BaseProductValidator } from './BaseProductValidator';

export class StockQuantityValidator extends BaseProductValidator {
  validate(product: ProductProps): string | undefined {
    if (product.stockQuantity < 0) {
      return 'A quantidade em estoque deve ser maior ou igual a zero.';
    }

    if (this.nextValidator) {
      return this.nextValidator.validate(product);
    }

    return undefined;
  }
}

import { Product } from 'src/entities/Product';
import { BaseCartValidator } from './BaseCartValidator';

export class StockValidator extends BaseCartValidator {
  validate(product: Product, quantity: number): string | undefined {
    if (product.stockQuantity - quantity < 0) {
      return `Produto '${product.name}' possui apenas ${
        product.stockQuantity
      } unidades. Retire ${
        quantity - product.stockQuantity
      } para poder finalizar a compra.`;
    }

    if (this.nextValidator) {
      return this.nextValidator.validate(product, quantity);
    }

    return undefined;
  }
}

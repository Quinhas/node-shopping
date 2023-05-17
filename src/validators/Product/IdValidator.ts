import { ProductProps } from '../../../src/entities/Product';
import { isValidUUID } from '../../../src/helpers/isValidUUID';
import { BaseProductValidator } from './BaseProductValidator';

export class IdValidator extends BaseProductValidator {
  validate(product: ProductProps): string | undefined {
    if (!isValidUUID(product.id)) {
      return 'O ID do produto deve ser um UUID válido.';
    }

    if (this.nextValidator) {
      return this.nextValidator.validate(product);
    }

    return undefined;
  }
}

import { ProductProps } from '../../../src/entities/Product';

export interface ProductValidator {
  validate(product: ProductProps): string | undefined;
  setNext(validator: ProductValidator): ProductValidator;
}

import { CartItem } from '../../../src/entities/Cart';
import { Product } from '../../../src/entities/Product';

export interface CartObserver {
  notifyAddProduct(product: Product, quantity: number): void;
  notifyRemoveProduct(product: Product, quantity: number): void;
  notifyFinishPurchase({
    items,
    totalPrice
  }: {
    items: CartItem[];
    totalPrice: number;
  }): void;
}

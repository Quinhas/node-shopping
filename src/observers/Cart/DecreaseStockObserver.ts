import { CartItem } from '../../../src/entities/Cart';
import { CartObserver } from './CartObserver';

export class DecreaseStockObserver implements CartObserver {
  notifyAddProduct(): void {
    return;
  }

  notifyRemoveProduct(): void {
    return;
  }

  notifyFinishPurchase({
    items
  }: {
    items: CartItem[];
    totalPrice: number;
  }): void {
    for (const item of items) {
      item.product.decreaseStockQuantity(item.quantity);
    }
  }
}

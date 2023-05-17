import { CartItem } from '../../../src/entities/Cart';
import { Product } from '../../../src/entities/Product';
import { formatCurrency } from '../../../src/helpers/formatCurrency';
import { CartObserver } from './CartObserver';

export class CartLogger implements CartObserver {
  notifyAddProduct(product: Product, quantity: number): void {
    console.log(
      `Produto ${product.id} adicionado ao carrinho. Quantidade: ${quantity}.`
    );
  }

  notifyRemoveProduct(product: Product, quantity: number): void {
    console.log(
      `Produto ${product.id} removido do carrinho. Quantidade: ${quantity}.`
    );
  }

  notifyFinishPurchase({
    items,
    totalPrice
  }: {
    items: CartItem[];
    totalPrice: number;
  }): void {
    console.log(
      `\nCompra finalizada com ${items.length} item${
        items.length !== 1 ? 's' : ''
      }. Valor Total: ${formatCurrency(totalPrice)}\n`
    );
  }
}

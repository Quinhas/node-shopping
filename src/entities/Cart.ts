import { CartObserver } from '../../src/observers/Cart/CartObserver';
import { StockValidator } from '../../src/validators/Cart/StockValidator';
import { Product } from './Product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export class Cart {
  private items: CartItem[] = [];
  private observers: CartObserver[] = [];

  public addObserver(observer: CartObserver): void {
    this.observers.push(observer);
  }

  public removeObserver(observer: CartObserver): void {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  public addProduct(product: Product, quantity = 1): boolean {
    if (quantity === 0) {
      return false;
    }
    const existingItem = this.items.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        product,
        quantity
      });
    }

    this.observers.forEach((observer) =>
      observer.notifyAddProduct(product, quantity)
    );

    return true;
  }

  public removeProduct(product: Product, quantity = 1): boolean {
    if (quantity === 0) {
      return false;
    }
    const existingItem = this.items.find(
      (item) => item.product.id === product.id
    );

    if (!existingItem) {
      return false;
    }

    existingItem.quantity -= quantity;

    if (existingItem.quantity <= 0) {
      this.items = this.items.filter((item) => item !== existingItem);
    }

    this.observers.forEach((observer) =>
      observer.notifyRemoveProduct(product, quantity)
    );

    return true;
  }

  public getProducts(): CartItem[] {
    return this.items;
  }

  public getTotalPrice(): number {
    return this.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }

  public clearCart(): void {
    this.items = [];
  }

  public finishPurchase(): void {
    const stockValidator = new StockValidator();

    for (const item of this.items) {
      const isOutOfStock = stockValidator.validate(item.product, item.quantity);

      if (isOutOfStock) {
        throw new Error(isOutOfStock);
      }
    }

    this.observers.forEach((observer) =>
      observer.notifyFinishPurchase({
        items: this.items,
        totalPrice: this.getTotalPrice()
      })
    );

    this.clearCart();
  }
}

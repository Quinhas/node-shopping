import { formatCurrency } from '../../src/helpers/formatCurrency';

export interface ProductProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
}

export class Product {
  private readonly props: ProductProps;

  constructor(props: ProductProps) {
    this.props = props;
  }

  public get id(): string {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }

  public get description(): string | null {
    return this.props.description;
  }

  public get price(): number {
    return this.props.price;
  }

  public get formattedPrice(): string {
    return formatCurrency(this.props.price);
  }

  public get stockQuantity(): number {
    return this.props.stockQuantity;
  }

  public decreaseStockQuantity(quantity = 1): void {
    this.props.stockQuantity -= quantity;
  }

  public increaseStockQuantity(quantity = 1): void {
    this.props.stockQuantity += quantity;
  }
}

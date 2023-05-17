import { randomUUID } from 'crypto';
import { Product } from '../../src/entities/Product';
import { IdValidator } from '../../src/validators/Product/IdValidator';
import { NameValidator } from '../../src/validators/Product/NameValidator';
import { PriceValidator } from '../../src/validators/Product/PriceValidator';
import { ProductValidator } from '../../src/validators/Product/ProductValidator';
import { StockQuantityValidator } from '../../src/validators/Product/StockQuantityValidator';

interface ProductBuilderProps {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
}

export class ProductBuilder {
  private props: ProductBuilderProps;
  private validator: ProductValidator;

  constructor() {
    this.props = {
      id: '',
      name: '',
      description: null,
      price: 0,
      stockQuantity: 0
    };
    const idValidator = new IdValidator();
    const nameValidator = new NameValidator();
    const priceValidator = new PriceValidator();
    const stockQuantityValidator = new StockQuantityValidator();

    idValidator.setNext(nameValidator);
    nameValidator.setNext(priceValidator);
    priceValidator.setNext(stockQuantityValidator);

    this.validator = idValidator;
  }

  public build(): Product {
    const hasError = this.validator.validate(this.props);

    if (hasError) {
      throw new Error(
        `Produto inválido. ID: ${this.props.id ?? 'NÃO_INFORMADO'} - Nome: ${
          this.props.name ?? 'NÃO_INFORMADO'
        } - Erro: ${hasError}`
      );
    }

    return new Product(this.props);
  }

  public withId(id?: string | null): ProductBuilder {
    this.props.id = id ?? randomUUID();
    return this;
  }

  public withName(name: string): ProductBuilder {
    this.props.name = name;
    return this;
  }

  public withDescription(description: string | null): ProductBuilder {
    this.props.description = description;
    return this;
  }

  public withPrice(price: number): ProductBuilder {
    this.props.price = price;
    return this;
  }

  public withStockQuantity(stockQuantity: number): ProductBuilder {
    this.props.stockQuantity = stockQuantity;
    return this;
  }
}

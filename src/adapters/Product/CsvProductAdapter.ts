import { ProductProps } from '../../../src/entities/Product';

export class CsvProductAdapter {
  public static toDomain(csv: string): ProductProps {
    const [id, name, description, priceString, stockQuantityString] =
      csv.split(';');

    const price = parseFloat(priceString);
    const stockQuantity = parseInt(stockQuantityString);

    return {
      id,
      name,
      description: !description
        ? null
        : description.trim().length === 0
          ? null
          : description.trim(),
      price: isNaN(price) ? 0 : price,
      stockQuantity: isNaN(stockQuantity) ? 0 : stockQuantity
    };
  }
}

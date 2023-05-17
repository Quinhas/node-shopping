import chalk from 'chalk';
import { readFileSync } from 'fs';
import prompts, { Choice } from 'prompts';
import { CsvProductAdapter } from './adapters/Product/CsvProductAdapter';
import { ProductBuilder } from './builders/ProductBuilder';
import { Cart } from './entities/Cart';
import { Product } from './entities/Product';
import { formatCurrency } from './helpers/formatCurrency';
import { CartLogger } from './observers/Cart/CartLogger';
import { DecreaseStockObserver } from './observers/Cart/DecreaseStockObserver';

/**
 * @namespace Development and Design Patterns
 *
 * @author Felipe Amaral - 601101
 * @author Jose Vicente - 609684
 * @author Lucas Santana - 601314
 * @author Luis Fernando - 579017
 * @author Matheus Colombo - 609307
 */
async function app() {
  // Gerador de produtos aleatórios
  // let csvData = '';

  // for (let i = 0; i < 50; i++) {
  //   const id =
  //     faker.number.int({ min: 0, max: 75 }) >= 50 ? faker.string.uuid() : null;
  //   const name = faker.commerce.productName();
  //   const description = faker.commerce.productDescription();
  //   const price = faker.commerce.price({ min: 0, dec: 2, max: 500 });
  //   const stockQuantity = faker.number.int({ min: 0, max: 300 });

  //   csvData += `${id};${name};${description};${price};${stockQuantity}\n`;
  // }

  // writeFileSync('./products.csv', csvData);

  const csvFile = readFileSync('./products.csv', { encoding: 'utf8' });
  const csvProducts = csvFile
    .split(/\r?\n/)
    .slice(0, -1)
    .map((line) => CsvProductAdapter.toDomain(line.trim()));

  const products: Product[] = [];
  let hasError = 0;

  csvProducts.forEach((productProps) => {
    try {
      const productBuilder = new ProductBuilder();
      const product = productBuilder
        .withId(productProps.id === 'null' ? null : productProps.id)
        .withName(productProps.name)
        .withDescription(productProps.description)
        .withPrice(productProps.price)
        .withStockQuantity(productProps.stockQuantity)
        .build();
      products.push(product);
      return;
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
      } else {
        console.log('Ocorreram erros na importação do produto.');
        console.log(err);
      }
      hasError++;
      return;
    }
  });

  if (hasError !== 0) {
    const message =
      hasError === 1
        ? 'produto não foi importado'
        : 'produtos não foram importados';
    const mustContinue = await prompts({
      type: 'confirm',
      name: 'value',
      message: `${hasError} ${message}. Continuar mesmo assim?`
    });

    if (mustContinue.value !== true) {
      return;
    }
  }

  if (products.length === 0) {
    console.error('Não há produtos cadastrados.');
    return;
  }

  const cart = new Cart();
  const cartLogger = new CartLogger();
  const decreaseStockObserver = new DecreaseStockObserver();

  cart.addObserver(cartLogger);
  cart.addObserver(decreaseStockObserver);

  let option = null;
  while (option === null || option !== 0) {
    option = (await printMainOptions(cart)).mainOptions;

    switch (option) {
    case 1: {
      const options: Choice[] = products.map((product) => ({
        title: `${chalk.bold(product.name)} ${chalk.green(
          ` - ${product.formattedPrice}`
        )} ${chalk.dim(
          ` - Quantidade disponível: ${product.stockQuantity}`
        )}`,
        value: product.id
      }));

      const question = await prompts(
        {
          type: 'select',
          name: 'selectedProductId',
          message: 'O que você deseja comprar?',
          choices: options
          // suggest: (input, choices) =>
          //   Promise.resolve(
          //     choices.filter((choice) => choice.title.includes(input))
          //   )
        },
        {
          onCancel: () => undefined
        }
      );

      if (question.selectedProductId === undefined) {
        break;
      }

      const selectedProduct = products.find(
        (p) => p.id === question.selectedProductId
      );

      if (!selectedProduct) {
        throw new Error('Produto inválido.');
      }

      console.log(chalk.dim.italic(selectedProduct.description));
      console.log();

      const quantity = await prompts(
        {
          type: 'number',
          min: 1,
          name: 'quantity',
          message: 'Quantidade: '
        },
        {
          onCancel: () => undefined
        }
      );

      if (quantity.quantity === undefined) {
        break;
      }

      cart.addProduct(selectedProduct, quantity.quantity);

      await pressEnter();

      break;
    }
    case 2: {
      const cartProducts = cart.getProducts();

      const options = cartProducts.map((item) => ({
        title: item.product.name,
        description: `Quantidade: ${item.quantity} - Preço Unitário: ${
          item.product.formattedPrice
        } - Preço total: ${formatCurrency(
          item.quantity * item.product.price
        )}`,
        value: item.product.id
      }));

      const question = await prompts(
        {
          type: 'select',
          name: 'selectedProductId',
          message: 'Selecione o produto que deseja remover',
          choices: options
          // suggest: (input, choices) =>
          //   Promise.resolve(
          //     choices.filter((choice) => choice.title.includes(input))
          //   )
        },
        {
          onCancel: () => undefined
        }
      );

      if (question.selectedProductId === undefined) {
        break;
      }

      const selectedProduct = cartProducts.find(
        (p) => p.product.id === question.selectedProductId
      );

      if (!selectedProduct) {
        throw new Error('Produto inválido.');
      }

      const quantity = await prompts(
        {
          type: 'number',
          min: 0,
          name: 'quantity',
          message: 'Quantidade a ser removida: ',
          validate: (value) =>
            value > selectedProduct.quantity
              ? `Você tem ${selectedProduct.quantity} unidades no carrinho.`
              : true
        },
        { onCancel: () => undefined }
      );

      if (quantity.quantity === undefined) {
        break;
      }

      cart.removeProduct(selectedProduct.product, quantity.quantity);

      await pressEnter();

      break;
    }
    case 3: {
      const cartProducts = cart.getProducts();

      console.log();

      cartProducts.map((item) => {
        console.log(
          `🔷 ${chalk.bold(
            `${item.product.name} | ${chalk.green(
              formatCurrency(item.quantity * item.product.price)
            )}`
          )} ${chalk.dim(
            `- Quantidade: ${item.quantity} - Valor Unitário: ${item.product.formattedPrice}`
          )}`
        );
      });

      console.log();
      console.log(
        chalk.bold(
          `🛒 Preço total: ${chalk.green(
            formatCurrency(cart.getTotalPrice())
          )}`
        )
      );

      await pressEnter();

      break;
    }
    case 4: {
      try {
        cart.finishPurchase();
      } catch (err) {
        console.log(`Não foi possível finalizar a compra! \n ${err}`);
      }

      await pressEnter();
      break;
    }
    }
  }
}

async function printMainOptions(cart: Cart) {
  console.clear();

  const emptyCart = cart.getProducts().length === 0;

  const options: Choice[] = [
    { title: 'Adicionar produto ao carrinho', value: 1 },
    {
      title: 'Remover produto do carrinho',
      value: 2,
      disabled: emptyCart
    },
    {
      title: 'Ver carrinho',
      value: 3,
      disabled: emptyCart
    },
    {
      title: 'Finalizar compra',
      value: 4,
      disabled: emptyCart
    },
    { title: 'Sair', value: 0 }
  ];

  return await prompts({
    type: 'select',
    name: 'mainOptions',
    message: 'O que você deseja fazer?',
    choices: options
  });
}

async function pressEnter() {
  await prompts({
    name: 'confirmAdd',
    message: 'Aperte enter para continuar.',
    type: 'invisible'
  });
}

app();

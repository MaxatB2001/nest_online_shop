import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from 'src/product/product.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderItem } from './order.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectModel(OrderItem) private orderItemRepository: typeof OrderItem,
    @InjectModel(Product) private productRepository: typeof Product,
  ) {}

  async order(dto: CreateOrderDto, req: any) {
    let { items } = req.body;

    items = JSON.parse(items);

    const products = await Promise.all(
      items.map((i) => this.productRepository.findByPk(i.product.id)),
    );

    let count = 0;

    for (let i = 0; i < products.length; i++) {
      if (products[i].quantity - items[i].quantity < 0) {
        count += 1;
      }
    }

    if (count > 0) {
      return null;
    }

    const order = await this.orderRepository.create(dto);

    items.forEach(async (i) => {
      const product = await this.productRepository.findByPk(i.product.id);
      product.update(
        { quantity: product.quantity - i.quantity },
        { where: { id: i.product.id } },
      );
      this.orderItemRepository.create({
        productId: i.product.id,
        orderId: order.id,
        quantity: i.quantity,
      });
    });

    return order;
  }

  async findUserOrders(id: number) {
    const orders = await this.orderRepository.findAll({
      where: { userId: id },
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
      ],
    });
    return orders;
  }
}

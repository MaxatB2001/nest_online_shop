import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { CategoryOrderCount } from 'src/categories/category.model';
import { Product, ProductOrderCount } from 'src/product/product.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderItem } from './order.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectModel(OrderItem) private orderItemRepository: typeof OrderItem,
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(CategoryOrderCount)
    private categoryOrderCountRepository: typeof CategoryOrderCount,
    @InjectModel(ProductOrderCount)
    private productOrderCountRepository: typeof ProductOrderCount,
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
      this.categoryOrderCountRepository.create({
        productQuantity: i.quantity,
        categoryId: i.product.categoryId,
      });
      this.productOrderCountRepository.create({
        quantity: i.quantity,
        productId: i.product.id,
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

  async sumAllOrders() {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(
      new Date().setMonth(lastMonth.getMonth() - 1),
    );
    const orders = await this.orderRepository.findAll({
      where: { createdAt: { [Op.between]: [firstDay, new Date()] } },
    });

    const sum = orders.reduce((acc, i) => acc + i.paidAmount, 0);
    return sum;
  }

  async monthlyEncome() {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(
      new Date().setMonth(lastMonth.getMonth() - 1),
    );
    const orders = await this.orderRepository.findAll({
      where: { createdAt: { [Op.between]: [firstDay, new Date()] } },
    });

    const groups = orders.reduce((groups, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(order);
      return groups;
    }, {});

    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date: Number(date.split('-')[2]),
        orders: groups[date].length,
      };
    });

    const sorted = groupArrays.sort((a, b) => {
      return a.date - b.date;
    });

    return sorted;
  }
}

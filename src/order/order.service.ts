import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderItem } from './order.model';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order) private orderRepository: typeof Order,
    @InjectModel(OrderItem) private orderItemRepository: typeof OrderItem,
  ) {}

  async order(dto: CreateOrderDto, req: any) {
    const order = await this.orderRepository.create(dto);

    let { items } = req.body;

    items = JSON.parse(items);

    items.forEach((i) =>
      this.orderItemRepository.create({
        productId: i.productId,
        orderId: order.id,
        quantity: i.quantity,
      }),
    );

    return order;
  }
}

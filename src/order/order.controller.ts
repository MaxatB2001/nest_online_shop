import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    return this.orderService.order(createOrderDto, req);
  }
}

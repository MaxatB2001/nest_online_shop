import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('/:id')
  getOrders(@Param('id') id: number) {
    return this.orderService.findUserOrders(id);
  }

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    return this.orderService.order(createOrderDto, req);
  }
}

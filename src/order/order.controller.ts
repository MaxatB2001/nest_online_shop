import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UseFilters,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/shared/exeption';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { CreateOrderStatusDto } from './dto/create-order-status.dto';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('/total')
  sumOrders() {
    return this.orderService.sumAllOrders();
  }

  @Get('/manager-orders')
  managerOrders() {
    return this.orderService.getManagerOrders();
  }

  @Get('/order-status')
  getOrderStatus() {
    return this.orderService.getOrderStatus();
  }

  @Get('/single/:id')
  getSingleOrder(@Param('id') id: number) {
    return this.orderService.getOrderById(id);
  }

  @Get('/:id')
  getOrders(@Param('id') id: number) {
    return this.orderService.findUserOrders(id);
  }

  @Get()
  getMonthOrders() {
    return this.orderService.monthlyEncome();
  }

  @Post()
  @UseFilters(new HttpExceptionFilter())
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const order = await this.orderService.order(createOrderDto, req);
    if (order === null) {
      throw new HttpException('s', HttpStatus.BAD_REQUEST);
    }
    return order;
  }

  @Post('/order-status')
  async createOrderStatus(@Body() createOrderStatusDto: CreateOrderStatusDto) {
    return this.orderService.createOrderStatus(createOrderStatusDto);
  }
}

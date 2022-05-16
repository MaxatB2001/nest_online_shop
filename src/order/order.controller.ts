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

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('/:id')
  getOrders(@Param('id') id: number) {
    return this.orderService.findUserOrders(id);
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
}

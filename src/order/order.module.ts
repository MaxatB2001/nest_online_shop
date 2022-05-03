import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from 'src/product/product.model';
import { User } from 'src/user/user.model';
import { OrderController } from './order.controller';
import { Order, OrderItem } from './order.model';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [SequelizeModule.forFeature([Product, User, Order, OrderItem])],
})
export class OrderModule {}

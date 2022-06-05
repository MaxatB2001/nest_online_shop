import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Product } from 'src/product/product.model';
import { User } from 'src/user/user.model';

interface OrderCreationAttr {
  address: string;
  comment: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  paidAmount: number;
  userId: number;
  statusId: number;
}

interface OrderItemCreationAttrs {
  productId: number;
  orderId: number;
  quantity: number;
}

interface OrderStatusCreationAttrs {
  value: string;
}

@Table({ tableName: 'order_status' })
export class OrderStatus extends Model<OrderStatus, OrderStatusCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  value: string;

  @HasMany(() => Order)
  orders: Order[];
}

@Table({ tableName: 'order' })
export class Order extends Model<Order, OrderCreationAttr> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  comment: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  paidAmount: number;

  @ForeignKey(() => OrderStatus)
  @Column({ type: DataType.INTEGER, allowNull: false })
  statusId: number;

  @BelongsTo(() => OrderStatus)
  status: OrderStatus;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => OrderItem)
  order_items: OrderItem[];
}

@Table({ tableName: 'order_item' })
export class OrderItem extends Model<OrderItem, OrderItemCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER, allowNull: false })
  orderId: number;

  @BelongsTo(() => Order)
  order: Order;
}

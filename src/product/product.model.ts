import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Brand } from 'src/brand/brand.model';
import { Category } from 'src/categories/category.model';
import { OrderItem } from 'src/order/order.model';
import { User } from 'src/user/user.model';

interface ProductCreationAttrs {
  name: string;
  price: number;
  quantity: number;
  slug: string;
  avaliable: boolean;
  image: string;
  brandId: number;
  categoryId: number;
}

interface StarCreationAttrs {
  value: number;
}

interface ReviewCreationAttrs {
  message: string;
  userId: number;
  productId: number;
  starId: number;
}

interface ProductFeaturesCreationAttrs {
  title: string;
  description: string;
  productId: number;
}

@Table({ tableName: 'product' })
export class Product extends Model<Product, ProductCreationAttrs> {
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
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  slug: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  avaliable: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;

  @ForeignKey(() => Brand)
  @Column({ type: DataType.INTEGER, allowNull: false })
  brandId: number;

  @BelongsTo(() => Brand)
  brand: Brand;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => Review)
  reviews: Review[];

  @HasMany(() => ProductFeatures)
  product_features: ProductFeatures[];

  @HasMany(() => OrderItem)
  order_items: OrderItem[];
}

@Table({ tableName: 'product_features' })
export class ProductFeatures extends Model<
  ProductFeatures,
  ProductFeaturesCreationAttrs
> {
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
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @BelongsTo(() => Product)
  product: Product;
}

@Table({ tableName: 'star' })
export class Star extends Model<Star, StarCreationAttrs> {
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
  value: number;

  @HasMany(() => Review)
  reviews: Review[];
}

@Table({ tableName: 'review' })
export class Review extends Model<Review, ReviewCreationAttrs> {
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
  message: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => Star)
  @Column({ type: DataType.INTEGER, allowNull: false })
  starId: number;

  @BelongsTo(() => Star)
  star: Star;
}

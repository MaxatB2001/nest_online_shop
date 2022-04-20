import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { Brand } from 'src/brand/brand.model';
import { CategoryBrand } from 'src/brand/brand_categories.model';
import { Product } from 'src/product/product.model';

interface CategoryCreationAttrs {
  title: string;
  slug: string;
  image: string;
  categoryId: number;
  icon: string;
}

@Table({ tableName: 'category' })
export class Category extends Model<Category, CategoryCreationAttrs> {
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
  image: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  icon: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  slug: string;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: true })
  categoryId: number;

  @BelongsTo(() => Category)
  parentCategory: Category;

  @HasMany(() => Category)
  subCategories: Category[];

  @BelongsToMany(() => Brand, () => CategoryBrand)
  brands: Brand[];

  @HasMany(() => Product)
  products: Product[];
}

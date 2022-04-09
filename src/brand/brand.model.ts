import { Table, Model, Column, DataType, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Category } from 'src/categories/category.model';
import { Product } from 'src/product/product.model';
import { CategoryBrand } from './brand_categories.model';

interface BrandCreationAttrs {
  title: string;
  slug: string;
  image: string;
  categoryId: number;
}

@Table({ tableName: 'brand' })
export class Brand extends Model<Brand, BrandCreationAttrs> {
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
    allowNull: false,
  })
  slug: string;

  @BelongsToMany(() => Category, () => CategoryBrand)
  categories: Category[];

  @HasMany(() => Product)
  products: Product[];
}

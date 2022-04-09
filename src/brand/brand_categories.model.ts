import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { Category } from 'src/categories/category.model';
import { Brand } from './brand.model';

@Table({ tableName: 'brand_cateogories', createdAt: false, updatedAt: false })
export class CategoryBrand extends Model<CategoryBrand> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Brand)
  @Column({
    type: DataType.INTEGER,
  })
  brandId: number;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
  })
  categoryId: number;
}

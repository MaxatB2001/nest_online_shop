import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Brand } from 'src/brand/brand.model';
import { CategoryBrand } from 'src/brand/brand_categories.model';
import { FilesModule } from 'src/files/files.module';
import { Product } from 'src/product/product.model';
import { ProductModule } from 'src/product/product.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './category.model';


@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    SequelizeModule.forFeature([Category, CategoryBrand, Brand, Product]),
    ProductModule,
    FilesModule
    
  ],
  exports: [CategoriesService]
})
export class CategoriesModule {}

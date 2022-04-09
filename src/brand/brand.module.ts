import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from 'src/categories/category.model';
import { FilesModule } from 'src/files/files.module';
import { Product } from 'src/product/product.model';
import { BrandController } from './brand.controller';
import { Brand } from './brand.model';
import { BrandService } from './brand.service';
import { CategoryBrand } from './brand_categories.model';

@Module({
  controllers: [BrandController],
  providers: [BrandService],
  imports:[
    FilesModule,
    SequelizeModule.forFeature([Category, Brand, CategoryBrand, Product])
  ],
  exports: [BrandModule]
})
export class BrandModule {}

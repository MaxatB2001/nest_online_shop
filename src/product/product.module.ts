import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Brand } from 'src/brand/brand.model';
import { Category } from 'src/categories/category.model';
import { FilesModule } from 'src/files/files.module';
import { User } from 'src/user/user.model';
import { ProductController } from './product.controller';
import { Product, ProductFeatures, Review, Star } from './product.model';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    FilesModule,
    AuthModule,
    SequelizeModule.forFeature([
      Product,
      Category,
      Brand,
      User,
      Review,
      ProductFeatures,
      Star,
    ]),
  ],
  exports: [ProductService],
})
export class ProductModule {}

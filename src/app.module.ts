import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { UserModule } from './user/user.module';
import { RolesModule } from './roles/roles.module';
import { User } from './user/user.model';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { FilesModule } from './files/files.module';
import { CategoriesModule } from './categories/categories.module';
import { Category, CategoryOrderCount } from './categories/category.model';
import {
  Product,
  ProductFeatures,
  ProductOrderCount,
  Review,
  Star,
} from './product/product.model';
import { BrandModule } from './brand/brand.module';
import { CategoryBrand } from './brand/brand_categories.model';
import { Brand } from './brand/brand.model';
import { OrderModule } from './order/order.module';
import { Order, OrderItem } from './order/order.model';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_HOST),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Role,
        UserRoles,
        Category,
        Product,
        CategoryBrand,
        Brand,
        Review,
        ProductFeatures,
        Star,
        Order,
        OrderItem,
        CategoryOrderCount,
        ProductOrderCount,
      ],
      autoLoadModels: true,
    }),
    UserModule,
    RolesModule,
    AuthModule,
    ProductModule,
    FilesModule,
    CategoriesModule,
    BrandModule,
    OrderModule,
  ],
})
export class AppModule {}

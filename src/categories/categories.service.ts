import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService, ImageType } from 'src/files/files.service';
import { Product } from 'src/product/product.model';
import sequelize from 'sequelize';
import { ProductService } from 'src/product/product.service';
import { Category, CategoryOrderCount } from './category.model';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category) private categoriesRepository: typeof Category,
    private productService: ProductService,
    private fileService: FilesService,
  ) {}

  async createCategory(dto: CreateCategoryDto, image) {
    const categoryImage = this.fileService.createFile(
      ImageType.CATEGORY,
      image,
    );
    const category = await this.categoriesRepository.create({
      ...dto,
      image: categoryImage,
    });
    return category;
  }

  async getAll() {
    const categories = await this.categoriesRepository.findAll({});
    return categories;
  }

  async get() {
    const categories = await this.categoriesRepository.findAll({
      where: { categoryId: null },
      include: [
        {
          model: Category,
          as: 'subCategories',
          include: [
            {
              model: Category,
              as: 'subCategories',
            },
          ],
        },
      ],
    });
    return categories;
  }

  async getLatest() {
    const categories = await this.categoriesRepository.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
    });
    return categories;
  }

  async getPopular() {
    const categories = await this.categoriesRepository.findAll({
      include: [
        {
          model: CategoryOrderCount,
          as: 'ordersCount',
        },
      ],
    });

    const counted = categories.map((c) => {
      const sum = c.ordersCount.reduce(
        (partialSum, a) => partialSum + a.productQuantity,
        0,
      );
      return { category: c, sum };
    });

    const sorted = counted.sort((a, b) => {
      return b.sum - a.sum;
    });
    return sorted.slice(0, 10);
  }

  async getSub(slug: string, req: any) {
    const categorie = await this.categoriesRepository.findOne({
      where: { slug },
      include: [
        {
          model: Category,
          as: 'subCategories',
        },
      ],
    });
    const subCategories = categorie.subCategories;
    if (subCategories.length > 0) {
      const res = {
        category: categorie,
        subs: subCategories,
      };
      return res;
    } else {
      const products = await this.productService.getProductsByCategory(
        categorie.id,
        req,
      );
      const res = {
        category: categorie,
        products: products,
      };
      return res;
    }
  }
}

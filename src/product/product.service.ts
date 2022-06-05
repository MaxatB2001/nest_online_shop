import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import sequelize, { Op } from 'sequelize';
import { FilesService, ImageType } from 'src/files/files.service';
import {
  Product,
  ProductFeatures,
  ProductOrderCount,
  Review,
  Star,
} from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Review) private reviewRepository: typeof Review,
    @InjectModel(ProductFeatures)
    private productFeatureRepository: typeof ProductFeatures,
    @InjectModel(Star) private reviewStarRepository: typeof Star,
    private fileService: FilesService,
    @InjectModel(ProductOrderCount)
    private productOrderCountRepository: typeof ProductOrderCount,
  ) {}

  async createProduct(dto, image, req) {
    const productImage = this.fileService.createFile(ImageType.PRODUCT, image);
    const product = await this.productRepository.create({
      ...dto,
      image: productImage,
    });

    let { feature } = req.body;

    if (feature) {
      feature = JSON.parse(feature);
      feature.forEach((f) =>
        this.productFeatureRepository.create({
          title: f.title,
          description: f.description,
          productId: product.id,
        }),
      );
    }

    return product;
  }

  async getProductBySlug(slug: string) {
    const product = await this.productRepository.findOne({
      where: { slug },
      include: [
        {
          model: ProductFeatures,
          as: 'product_features',
        },
        {
          model: Review,
          as: 'reviews',
        },
      ],
    });
    return product;
  }

  async getProductsByCategory(categorieId: number, req: any) {
    let { brandId } = req.query;
    let { page, limit } = req.query;
    let { max, min } = req.query;
    min = Number(min);
    max = Number(max);
    brandId = JSON.parse(brandId);
    page = page || 1;
    limit = limit || 9;
    const offset = page * limit - limit;
    let products;
    if ((!brandId || brandId.length === 0) && max == 0 && min == 0) {
      const count = await this.productRepository.count({
        where: { categoryId: categorieId },
      });

      const maxPrice = await this.productRepository.findOne({
        attributes: [[sequelize.fn('MAX', sequelize.col('price')), 'max']],
      });

      const minPrice = await this.productRepository.findOne({
        attributes: [[sequelize.fn('MIN', sequelize.col('price')), 'min']],
      });

      const rows = await this.productRepository.findAll({
        where: { categoryId: categorieId },
        limit,
        offset,
        include: [
          {
            model: Review,
            as: 'reviews',
          },
          {
            model: ProductFeatures,
            as: 'product_features',
          },
        ],
      });
      products = {
        count,
        rows,
        maxPrice,
        minPrice,
      };
    }

    if ((!brandId || brandId.length === 0) && (min || max)) {
      products = await Product.findAndCountAll({
        where: {
          categoryId: categorieId,
          price: { [Op.between]: [min, max] },
        },
        limit,
        offset,
        include: [
          {
            model: Review,
            as: 'reviews',
          },
          {
            model: ProductFeatures,
            as: 'product_features',
          },
        ],
      });
    }

    if (brandId.length > 0 && (min || max)) {
      products = await Product.findAndCountAll({
        where: {
          brandId: brandId,
          categoryId: categorieId,
          price: { [Op.between]: [min, max] },
        },
        limit,
        offset,
        include: [
          {
            model: Review,
            as: 'reviews',
          },
          {
            model: ProductFeatures,
            as: 'product_features',
          },
        ],
      });
    }
    return products;
  }

  async createReview(dto) {
    const review = await this.reviewRepository.create(dto);
    return review;
  }

  async findBySearch(query) {
    const products = await this.productRepository.findAll({
      where: {
        name: sequelize.where(
          sequelize.fn('LOWER', sequelize.col('name')),
          'LIKE',
          `%${query.toLowerCase()}%`,
        ),
      },
      include: [
        {
          model: ProductFeatures,
          as: 'product_features',
        },
        {
          model: Review,
          as: 'reviews',
        },
      ],
    });
    return products;
  }

  async getLatestProducts() {
    const latest = await this.productRepository.findAll({
      include: [
        {
          model: Review,
          as: 'reviews',
        },
      ],
      limit: 8,
      order: [['createdAt', 'DESC']],
    });
    return latest;
  }

  async getProductReviews(id) {
    const reviews = await this.reviewRepository.findAll({
      where: { productId: id },
      include: { all: true },
    });
    return reviews;
  }

  async getStars() {
    const stars = await this.reviewStarRepository.findAll({
      include: { all: true },
    });
    return stars;
  }

  async createStar(dto) {
    const star = await this.reviewStarRepository.create(dto);
    return star;
  }

  async getAlikeProducts(req: any) {
    const { categoryId } = req.query;
    const { brandId } = req.query;
    let { price } = req.query;
    price = Number(price);
    const products = await this.productRepository.findAll({
      where: {
        categoryId,
        brandId,
        price: { [Op.between]: [price - 10000, price + 10000] },
      },
      include: { all: true },
    });
    return products;
  }

  async getMonthCount() {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const orders = await this.productOrderCountRepository.findAll({
      where: { createdAt: { [Op.between]: [firstDay, new Date()] } },
    });
    const count = orders.reduce((acc, val) => acc + val.quantity, 0);
    return count;
  }
}

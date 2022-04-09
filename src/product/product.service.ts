import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService, ImageType } from 'src/files/files.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Product, ProductFeatures, Review } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Review) private reviewRepository: typeof Review,
    @InjectModel(ProductFeatures)
    private productFeatureRepository: typeof ProductFeatures,
    private fileService: FilesService,
  ) {}

  async createProduct(dto, image) {
    const productImage = this.fileService.createFile(ImageType.PRODUCT, image);
    const product = await this.productRepository.create({
      ...dto,
      image: productImage,
    });
    return product;
  }

  async getProductBySlug(slug) {
    const product = await this.productRepository.findOne({
      where: { slug },
      include: { all: true },
    });
    return product;
  }

  async getProductsByCategory(categorieId: number) {
    const products = await this.productRepository.findAll({
      where: { categoryId: categorieId },
      include: { all: true },
    });
    return products;
  }

  async createReview(dto, userId, productSlug) {
    const product = await this.productRepository.findOne({
      where: { slug: productSlug },
    });
    const review = await this.reviewRepository.create({
      ...dto,
      userId: userId,
      productId: product.id,
    });
    return review;
  }

  async createFeature(dto) {
    const productFeature = await this.productFeatureRepository.create(dto);
    return productFeature;
  }

  async getLatestProducts() {
    const latest = await this.productRepository.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
    });
    return latest;
  }
}

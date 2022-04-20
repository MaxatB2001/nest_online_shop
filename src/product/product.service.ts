import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService, ImageType } from 'src/files/files.service';
import { Product, ProductFeatures, Review, Star } from './product.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private productRepository: typeof Product,
    @InjectModel(Review) private reviewRepository: typeof Review,
    @InjectModel(ProductFeatures)
    private productFeatureRepository: typeof ProductFeatures,
    @InjectModel(Star) private reviewStarRepository: typeof Star,
    private fileService: FilesService,
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

  async getLatestProducts() {
    const latest = await this.productRepository.findAll({
      limit: 5,
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
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateStarDto } from './dto/create-star.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('/alike')
  getAlike(@Req() req: any) {
    return this.productService.getAlikeProducts(req);
  }
  @Get('/monthSales')
  getMonthSalesCount() {
    return this.productService.getMonthCount();
  }

  @Get('/latest')
  getLatest() {
    return this.productService.getLatestProducts();
  }

  @Get('/:slug')
  getOne(@Param('slug') slug: string) {
    return this.productService.getProductBySlug(slug);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Req() req: any,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() image,
  ) {
    return this.productService.createProduct(createProductDto, image, req);
  }

  @Get('/review/star')
  getReviewStars() {
    return this.productService.getStars();
  }

  @Post('/review/star')
  createReviewStar(@Body() createStarDto: CreateStarDto) {
    return this.productService.createStar(createStarDto);
  }

  @Get('/reviews/:id')
  getAllReview(@Param('id') id: number) {
    return this.productService.getProductReviews(id);
  }

  @Post('/review')
  createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.productService.createReview(createReviewDto);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductFeatureDto } from './dto/create-product-feature.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

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
  create(@Body() createProductDto: CreateProductDto, @UploadedFile() image) {
    return this.productService.createProduct(createProductDto, image);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/review/:slug')
  createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Request() req,
    @Param('slug') slug: string,
  ) {
    return this.productService.createReview(createReviewDto, req.user.id, slug);
  }

  @Post('/feature')
  createProductFeature(
    @Body() createProductFeatureDto: CreateProductFeatureDto,
  ) {
    return this.productService.createFeature(createProductFeatureDto);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() image) {
    return this.categoriesService.createCategory(createCategoryDto, image);
  }

  @Get('/all')
  getAllCategories() {
    return this.categoriesService.getAll();
  }

  @Get()
  getParentCategories() {
    return this.categoriesService.get();
  }

  @Get('/latest')
  getLatestCategories() {
    return this.categoriesService.getLatest();
  }

  @Get('/popular')
  getPopularCategories() {
    return this.categoriesService.getPopular();
  }

  @Get('/:slug')
  getSubCategories(@Param('slug') slug: string, @Req() req: any) {
    return this.categoriesService.getSub(slug, req);
  }
}

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

  @Get()
  getParentCategories() {
    return this.categoriesService.get();
  }

  @Get('/all')
  getAllcategories() {
    return this.categoriesService.getAll();
  }

  @Get('/:slug')
  getSubCategories(@Param('slug') slug: string, @Req() req: any) {
    console.log(req.query);
    return this.categoriesService.getSub(slug, req);
  }
}

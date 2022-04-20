import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';

@Controller('brand')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get()
  getBrands() {
    return this.brandService.get();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  Create(@Body() brandDto: CreateBrandDto, @UploadedFile() image) {
    return this.brandService.createBrand(brandDto, image);
  }
}

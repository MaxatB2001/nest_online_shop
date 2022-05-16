import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService, ImageType } from 'src/files/files.service';
import { Brand } from './brand.model';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand) private brandRepostitory: typeof Brand,
    private fileService: FilesService,
  ) {}

  async get() {
    const brands = await this.brandRepostitory.findAll({
      include: { all: true },
    });
    return brands;
  }

  async createBrand(dto: CreateBrandDto, image) {
    const brandImage = this.fileService.createFile(ImageType.BRAND, image);
    const brand = await this.brandRepostitory.create({
      ...dto,
      image: brandImage,
    });
    brand.$set('categories', dto.categoryId);
    return brand;
  }
}

export class CreateProductDto {
  readonly name: string;
  readonly price: number;
  readonly slug: string;
  readonly quantity: number;
  readonly avaliable: boolean;
  readonly brandId: number;
  readonly categoryId: number;
}

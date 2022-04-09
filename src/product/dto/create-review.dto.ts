export class CreateReviewDto {
  readonly message: string;
  readonly rating: number;
  readonly userId: number;
  readonly productId: number;
}
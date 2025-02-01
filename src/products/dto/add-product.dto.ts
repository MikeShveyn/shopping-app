import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class AddProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

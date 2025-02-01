import { IsOptional, IsString, IsIn } from 'class-validator';

export class ListProductsDto {
  @IsOptional()
  @IsIn(['name', 'price'])
  orderby?: string;

  @IsOptional()
  @IsString()
  searchPhrase?: string;
}

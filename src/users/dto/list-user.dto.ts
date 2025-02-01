import { IsOptional, IsString, IsIn } from 'class-validator';

export class ListUsersDto {
  @IsOptional()
  @IsIn(['firstName', 'lastName', 'createTime'])
  orderby?: string;

  @IsOptional()
  @IsString()
  searchPhrase?: string;
}

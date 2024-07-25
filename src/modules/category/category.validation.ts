
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

// DTO để tạo mới category
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly description?: string;
}

// DTO để cập nhật category
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
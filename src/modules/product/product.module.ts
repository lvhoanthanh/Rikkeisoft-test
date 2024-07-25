import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../../models/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CategoryEntity } from '../../models/category.entity';
import { FileEntity } from '../../models/file.entity';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity, FileEntity]), FileModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
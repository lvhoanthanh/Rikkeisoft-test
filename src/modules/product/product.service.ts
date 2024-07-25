import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../models/product.entity';
import { CreateProductDto, UpdateProductDto } from './product.validation';
import { CategoryEntity } from '../../models/category.entity';
import { FileEntity } from '../../models/file.entity';
import { CommonHelper } from "../../helpers/common";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async createProduct(createProductDto: CreateProductDto, fileEntity?: FileEntity): Promise<ProductEntity> {
    const { name, description, price, categoryId } = createProductDto;

    const category = await this.categoryRepository.findOne(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    const product = new ProductEntity();
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.image = fileEntity || null;

    return this.productRepository.save(product);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });
    if (!product) {
      throw new Error('Product not found');
    }
    return this.productRepository.save(product);
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new Error('Product not found');
    }
    await this.productRepository.remove(product);
  }

  async getProductById(id: string): Promise<ProductEntity> {
    return this.productRepository.findOne(id, { relations: ['category', 'image'] });
  }

  async fetchProducts(paginationOptions, searchQuery): Promise<any> {
    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // Apply search filters
    Object.keys(searchQuery).forEach(key => {
      queryBuilder.andWhere(`product.${key} LIKE :${key}`, { [`${key}`]: `%${searchQuery[key]}%` });
    });

    // Use the pagination helper method
    return CommonHelper.pagination(paginationOptions, queryBuilder);
  }
}
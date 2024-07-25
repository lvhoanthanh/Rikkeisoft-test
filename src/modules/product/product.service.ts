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
  ) { }

  async createProduct(createProductDto: CreateProductDto): Promise<ProductEntity> {
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
    return this.productRepository.save(product);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto, file?: any): Promise<ProductEntity> {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });

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
    const queryBuilder = this.productRepository.createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.image', 'files');

    if (searchQuery.keyword) {
      queryBuilder.where('products.name LIKE :keyword', { keyword: `%${searchQuery.keyword}%` });
    }
    // Filter by multiple categories if provided
    if (searchQuery.categoryIds && searchQuery.categoryIds.length > 0) {
      queryBuilder.andWhere('category.id IN (:...categoryIds)', { categoryIds: searchQuery.categoryIds });
    }

    // Use the pagination helper method
    return CommonHelper.pagination(paginationOptions, queryBuilder);
  }
}
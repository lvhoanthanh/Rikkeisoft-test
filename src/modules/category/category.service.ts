import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../models/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './category.validation';
import { CommonHelper } from "../../helpers/common";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {

    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });
    if (!category) {
      throw new Error('Category not found');
    }
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne(id);
    if (!category) {
      throw new Error('Category not found');
    }
    await this.categoryRepository.remove(category);
  }

  async getCategoryById(id: string): Promise<CategoryEntity> {
    return this.categoryRepository.findOne(id);
  }

  
  async getCategoryByName(name: string): Promise<CategoryEntity> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: name },
    });
    return existingCategory
  }

  async fetchCategories(paginationOptions, searchQuery): Promise<any> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('categories')
    if(searchQuery.keyword) 
      queryBuilder.where('categories.name LIKE :keyword', { keyword: `%${searchQuery.keyword}%` });
    // Use the pagination helper method
    return CommonHelper.pagination(paginationOptions, queryBuilder);
  }
}
import { Controller, Get, Param, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.validation';
import { CommonHelper } from "../../helpers/common";

@Controller('/api/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.categoryService.createCategory(createCategoryDto);
      return {
        message: 'Category created successfully',
        category,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Put('/:id')
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryService.updateCategory(id, updateCategoryDto);
      return {
        message: 'Category updated successfully',
        category,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Delete('/:id')
  async deleteCategory(@Param('id') id: string) {
    try {
      await this.categoryService.deleteCategory(id);
      return {
        message: 'Category deleted successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('/:id')
  async getCategoryById(@Param('id') id: string) {
    try {
      const category = await this.categoryService.getCategoryById(id);
      return {
        message: 'Category fetched successfully',
        category,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('')
  async fetchCategories(@Query() query) {
    try {
      const convertDataForPagination = await CommonHelper.convertDataForPagination(query);
      const categoryEntities = await this.categoryService.fetchCategories(
        convertDataForPagination.pagination,
        convertDataForPagination.searchQuery
      );

      return CommonHelper.successResponsePayload(
        'Fetch categories successfully',
        categoryEntities
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
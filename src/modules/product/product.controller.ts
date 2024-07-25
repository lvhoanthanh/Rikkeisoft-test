import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
  UploadedFile, UseInterceptors, HttpException, HttpStatus
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { ProductService } from "./product.service";
import { CreateProductDto, UpdateProductDto } from "./product.validation";
import { CommonHelper } from "../../helpers/common";
import { FileService } from '../file/file.service';
import { FileEntity } from '../../models/file.entity';

@Controller('/api/products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly fileService: FileService, // Inject FileService
  ) { }

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto
  ) {
    try {
      let fileEntity;
      if (!file) {
        fileEntity = await this.fileService.uploadFileInternal(file);

        // Save the product with file reference
        const product = await this.productService.createProduct({ ...createProductDto }, fileEntity);

        return {
          status: 'success',
          message: 'Product and file created successfully',
          data: product
        };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/:id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productService.updateProduct(id, updateProductDto);

      return CommonHelper.successResponsePayload(
        'Product updated successfully',
        product
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    try {
      await this.productService.deleteProduct(id);
      return CommonHelper.successResponsePayload(
        'Product updated successfully',
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('/:id')
  async getProductById(@Param('id') id: string) {
    console.log(id, 'aaaaaaaa')
    try {
      const product = await this.productService.getProductById(id);
      return CommonHelper.successResponsePayload(
        'Product updated successfully',
        product
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  @Get('')
  async fetchProducts(@Query() query) {
    try {
      const convertDataForPagination = await CommonHelper.convertDataForPagination(query);
      const productEntities = await this.productService.fetchProducts(
        convertDataForPagination.pagination,
        convertDataForPagination.searchQuery
      );

      return CommonHelper.successResponsePayload(
        'Fetch products successfully',
        productEntities
      );
    } catch (error) {
      throw new Error(error);
    }
  }
}
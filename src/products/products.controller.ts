import { Body, Headers, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddProductDto } from './dto/add-product.dto';
import { ProductsService } from './products.service';
import { ListProductsDto } from './dto/list-product.dto';
import { Product } from './product.model';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {

    constructor(private readonly productsService: ProductsService) {}
    
    /**
     * Add new Product using userId from Headers and data
     * @param userId 
     * @param addProductDto 
     * @returns 
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async addProduct(
      @Headers('userId') userId: string,
      @Body() addProductDto: AddProductDto
    ): Promise<{ productId: string }> {
      const product = await this.productsService.addProduct(userId, addProductDto);
      return { productId: product.productId };
    }

    /**
     * Get list of products with sort and filters
     * @param listProductsDto 
     * @returns 
     */
    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    async listProducts(@Query() listProductsDto: ListProductsDto): Promise<{ products: Product[]; total: number }> {
      return this.productsService.listProducts(listProductsDto.orderby, listProductsDto.searchPhrase);
    }

    /**
     * Update existing Product using userId from Headers, product Id and data
     * @param userId 
     * @param productId 
     * @param updateProductDto 
     * @returns 
     */
    @Patch(':productId')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async updateProduct(
      @Headers('userId') userId: string,
      @Param('productId') productId: string,
      @Body() updateProductDto: UpdateProductDto
    ): Promise<Product> {
      return this.productsService.updateProduct(userId, productId, updateProductDto);
    }

}

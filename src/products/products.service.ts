import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { AddProductDto } from './dto/add-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Op } from 'sequelize';
import { User } from 'src/users/user.model';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product)
        private readonly productModel: typeof Product,
      ) {}

      /**
       * Cretae new Product isong userId
       * @param userId 
       * @param addProductDto 
       * @returns 
       */
      async addProduct(userId: string, addProductDto: AddProductDto): Promise<Product> {
        const dataToSend = {
            ...addProductDto, userId
        }
        return this.productModel.create(dataToSend as any);
      }

      /**
       * 
       * @param userId 
       * @param productId 
       * @param updateProductDto 
       * @returns 
       */
      async updateProduct(userId: string, productId: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.productModel.findByPk(productId);
    
        if (!product) {
          throw new NotFoundException('Product not found');
        }
    
        if (product.userId !== userId) {
          throw new ForbiddenException('You are not allowed to update this product');
        }
    
        await product.update(updateProductDto);
        return product;
      }

      /**
       * 
       * @param orderBy 
       * @param searchPhrase 
       * @returns 
       */
      async listProducts(orderBy?: string, searchPhrase?: string): Promise<{ products: Product[]; total: number }> {
        let orderColumn = 'productName'; // Default sorting column
        if (orderBy === 'price') {
          orderColumn = 'price';
        }
    
        const whereClause = searchPhrase
          ? { productName: { [Op.iLike]: `%${searchPhrase}%` } }
          : {};
    
        const products = await this.productModel.findAll({
          where: whereClause,
          order: [[orderColumn, 'ASC']],
        //  include: [{ model: User }] // we can include also
        });
    
        return { products, total: products.length };
      }


}

import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { AddProductDto } from './dto/add-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Op, Sequelize } from 'sequelize';
import { User } from 'src/users/user.model';
import { Order } from 'src/orders/order.model';
import { BuyProductDto } from './dto/buy-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product)
        private readonly productModel: typeof Product,
        @InjectModel(Order)
        private readonly orderModel: typeof Order,
      ) {}

      /**
       * Cretae new Product and points to userId
       * @param userId 
       * @param addProductDto 
       * @returns productId or error
       */
      async addProduct(userId: string, addProductDto: AddProductDto): Promise<Product> {

        const dataToSend = {
            ...addProductDto, userId
        }
        return this.productModel.create(dataToSend as any);
      }

      /**
       * Update logic checks that userId is owner of product and updates data
       * @param userId 
       * @param productId 
       * @param updateProductDto 
       * @returns Project model
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
       *  Return list of all products and total number
       * @param orderBy 
       * @param searchPhrase 
       * @returns total number and list of projects
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


      /**
       * Buy product , remove count and add it to Order Table
       * @param userId 
       * @param productId 
       * @param buyProductDto 
       * @returns status success
       */
      async buyProduct(userId: string, productId: string, buyProductDto: BuyProductDto): Promise<{ message: string }> {
        const product = await this.productModel.findByPk(productId);
    
        if (!product) {
          throw new NotFoundException('Product not found');
        }
    
        if (product.userId === userId) {
          throw new ForbiddenException('You cannot buy your own product');
        }
    
        if (product.quantity < buyProductDto.quantity) {
          throw new BadRequestException('Not enough stock available');
        }
   
        await product.update({
          quantity: product.quantity - buyProductDto.quantity,
          soldCount: product.soldCount + buyProductDto.quantity,
        });
        
        const newData = {
            userId,
            productId,
            quantity: buyProductDto.quantity,
            totalPrice: buyProductDto.quantity * product.price,
          }
        await this.orderModel.create(newData as any);
    
        return { message: 'Purchase successful' };
      }


      /**
       * 
       * @param userId 
       * @param productId 
       * @returns 
       */
      async getProductStatistics(userId: string, productId: string) {
        const product = await this.productModel.findByPk(productId, {
          include: [{ model: User, attributes: ['username'] }],
        });
    
        if (!product) {
          throw new NotFoundException('Product not found');
        }
    
        if (product.userId !== userId) {
          throw new ForbiddenException('You are not allowed to access statistics for this product');
        }
    
        const orders = await this.orderModel.findAll({
          where: { productId },
          include: [{ model: User, attributes: ['username'] }],
        });
        console.log(orders)
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);
        const buyers = orders.map(order => order.user.username);
    
        return {
          productId: product.id,
          productName: product.productName,
          itemsSold: product.soldCount,
          itemsLeft: product.quantity,
          totalRevenue,
          buyers,
        };
      }

}

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
        private sequelize: Sequelize
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


      /**
       * 
       * @param userId 
       * @param productId 
       * @param buyProductDto 
       * @returns 
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
    
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
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


      /**
       * 
       * @returns 
       */
      async getOverallStatistics() {
        const totalProducts = await this.productModel.count();
        const availableProducts = await this.productModel.count({ where: { quantity: { [Op.gt]: 0 } } });
      
        const totalRevenue = await this.orderModel.sum('totalPrice');
      
        const topProducts = await this.productModel.findAll({
          order: [['soldCount', 'DESC']],
          limit: 5,
          attributes: ['productName', 'soldCount'],
        });
      
        const topSellers = await this.productModel.findAll({
          attributes: [
            'userId',
            [this.sequelize.fn('SUM', this.sequelize.col('soldCount')), 'totalSold'],
          ],
          group: ['userId'],
          order: [[this.sequelize.fn('SUM', this.sequelize.col('soldCount')), 'DESC']],
          limit: 5,
        });
      
        const topBuyers = await this.orderModel.findAll({
          attributes: [
            'userId',
            [this.sequelize.fn('SUM', this.sequelize.col('quantity')), 'totalBought'],
          ],
          group: ['userId'],
          order: [[this.sequelize.fn('SUM', this.sequelize.col('quantity')), 'DESC']],
          limit: 5,
        });
      
        return {
          totalProducts,
          availableProducts,
          totalRevenue,
          topProducts,
          topSellers,
          topBuyers,
        };
    }

}

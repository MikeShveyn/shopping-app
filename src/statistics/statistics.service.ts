import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { col, fn, literal, Op, Sequelize } from 'sequelize';
import { Order } from 'src/orders/order.model';
import { Product } from 'src/products/product.model';
import { User } from 'src/users/user.model';

@Injectable()
export class StatisticsService {

    constructor(
        @InjectModel(Product)
        private readonly productModel: typeof Product,
        @InjectModel(Order)
        private readonly orderModel: typeof Order,
        @InjectModel(User)
        private readonly userModel: typeof User,
    ){}

     /**
      * Get overal statistic based on Products data and Orders
      * @returns  statistics object 
      */
      async getOverallStatistics() {
        const totalProducts = await this.productModel.count();
        const availableProducts = await this.productModel.count({ where: { quantity: { [Op.gt]: 0 } } });
        const availableQuantity = await this.productModel.sum('quantity', { where: { quantity: { [Op.gt]: 0 } } });
        const totalRevenue = await this.orderModel.sum('totalPrice') || 0;

        const topProducts = await this.productModel.findAll({
          order: [['soldCount', 'DESC']],
          limit: 5,
          attributes: ['productName', 'soldCount'],
        });
        
        // get top sellers 
        const topSellers = await this.productModel.findAll({
          attributes: [
            ['userId', 'userId'], 
            [fn('SUM', col('soldCount')), 'totalSold'],  
          ],
          group: ['Product.userId', 'user.userId'], 
          order: [[fn('SUM', col('soldCount')), 'DESC']], 
          limit: 5,
          include: [{ model: User, attributes: ['username'] }],
          raw: true,  
        });
        
        // get top buyers
        const topBuyers = await this.orderModel.findAll({
          attributes: [
            ['userId', 'userId'],  
            [fn('SUM', col('Order.quantity')), 'totalBought'], 
          ],
          group: ['Order.userId', 'user.userId'],  
          order: [[fn('SUM', col('Order.quantity')), 'DESC']], 
          limit: 5,
          include: [{ model: User, attributes: ['username'] }],  
          raw: true  
        }); 
        console.log(topBuyers)
        // get all products
        const allProducts = await this.productModel.findAll({
          attributes: [
            'productId',
            'productName',
            'price',
            'quantity',
            'soldCount',
            [fn('SUM', col('Product.price')), 'totalRevenue'], 
          ],
          group: ['Product.productId'], 
          order: [['soldCount', 'DESC']],  
          raw: true 
        });
        
     
        return {
          totalProducts,
          availableProducts,
          availableQuantity,
          totalRevenue: Number(totalRevenue), 
          topProducts,
          topSellers: topSellers.map(seller => ({
            userId: seller.userId,
            username: seller['user.username'] || 'Unknown',
            totalSold: Number(seller['totalSold']),
          })),
          topBuyers: topBuyers.map(buyer => ({
            userId: buyer.userId,
            username: buyer['user.username'] || 'Unknown',
            totalBought: Number(buyer['totalBought']),
          })),
           allProducts,
        };
    }
}

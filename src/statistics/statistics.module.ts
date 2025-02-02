import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Product } from 'src/products/product.model';
import { Order } from 'src/orders/order.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';


@Module({
  imports: [SequelizeModule.forFeature([Product, Order, User])],
  providers: [StatisticsService],
  controllers: [StatisticsController]
})
export class StatisticsModule {}

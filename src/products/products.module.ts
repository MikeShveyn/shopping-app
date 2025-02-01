import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './product.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from 'src/orders/order.model';
import { User } from 'src/users/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Product, Order, User])],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}

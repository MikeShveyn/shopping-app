import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
// import { ProductsModule } from './products/products.module';
// import { StatisticsModule } from './statistics/statistics.module';
// import { OrdersModule } from './orders/orders.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { databaseConfig } from './configs/db.config';

@Module({
  imports: [
      SequelizeModule.forRoot(databaseConfig),
      UsersModule,
      // ProductsModule,
      // StatisticsModule, 
      // OrdersModule
    ],
  controllers: [],
  providers: [],
})
export class AppModule {}

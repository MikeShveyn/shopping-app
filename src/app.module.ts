import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [UsersModule, ProductsModule, StatisticsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

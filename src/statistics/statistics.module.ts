import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { ProductsModule } from 'src/products/products.module';

@Module({
  providers: [StatisticsService],
  controllers: [StatisticsController]
})
export class StatisticsModule {}

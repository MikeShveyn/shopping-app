import { Controller, Get } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';

@Controller('statistics')
export class StatisticsController {

    constructor(private readonly productsService: ProductsService) {}
        
    @Get()
    async getOverallStatistics() {
        return this.productsService.getOverallStatistics();
    }
}

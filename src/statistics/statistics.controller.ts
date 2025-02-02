import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';


@Controller('statistics')
export class StatisticsController {

    constructor(private readonly statisticsService: StatisticsService) {}
    
    /**
     * Returns statistic about shop
     * @returns overal statistic
     */
    @Get()
    async getOverallStatistics() {
        return this.statisticsService.getOverallStatistics();
    }
}

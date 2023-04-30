import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AirQualityController } from './controllers';
import { CityPollutionDataPoint } from './entities';
import { AirQualityService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([CityPollutionDataPoint])],
  controllers: [AirQualityController],
  providers: [AirQualityService],
})
export class AirModule {}

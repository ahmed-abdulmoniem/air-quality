import { Module } from '@nestjs/common';

import { AirQualityController } from './controllers';
import { AirQualityService } from './services';

@Module({
  controllers: [AirQualityController],
  providers: [AirQualityService],
})
export class AirModule {}

import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AirQualityService } from 'src/air/services';

import { GetAirQualityDto } from './../../dto';

@ApiTags('Air Quality')
@Controller('air-quality')
export class AirQualityController {
  constructor(private airQualityService: AirQualityService) {}

  @Get('/')
  @ApiQuery({
    name: 'lat',
    required: true,
    example: '48.856613',
    description: 'The latitude of a GPS coordinate',
    schema: { oneOf: [{ type: 'number' }] },
  })
  @ApiQuery({
    name: 'lng',
    required: true,
    example: '2.352222',
    description: 'The longitude of a GPS coordinate',
    schema: { oneOf: [{ type: 'number' }] },
  })
  async getAirQuality(@Query() query: GetAirQualityDto) {
    const response = await this.airQualityService.getNearestCityByCoordinates(
      query.lat,
      query.lng,
    );

    return {
      Result: {
        Pollution: response.data?.current?.pollution,
      },
    };
  }
}

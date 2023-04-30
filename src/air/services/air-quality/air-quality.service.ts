import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CityPollutionDataPoint } from '../../entities';

const axios = require('axios').default;

@Injectable()
export class AirQualityService {
  private readonly baseUrl = 'http://api.airvisual.com';

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(CityPollutionDataPoint)
    private cityPollutionDataPointRepository: Repository<CityPollutionDataPoint>,
  ) {}

  async getNearestCityByCoordinates(lat: number, lng: number) {
    const apiKey = this.configService.get<string>('IQAIR_API_KEY');

    const url = `${this.baseUrl}/v2/nearest_city?lat=${lat}&lon=${lng}&key=${apiKey}`;

    try {
      const response = await axios.get(url);

      console.log(JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  @Cron('* * * * *')
  async getParisPollutionDataPoint() {
    const parisLat = 48.856613;
    const parisLng = 2.352222;

    const response = await this.getNearestCityByCoordinates(parisLat, parisLng);

    await this.cityPollutionDataPointRepository.save({
      samplingDateTime: new Date(),
      pollutionIndexRecordDateTime: new Date(
        response?.data?.current?.pollution?.ts,
      ),
      city: response?.data?.city,
      state: response?.data?.state,
      country: response?.data?.country,
      pollutionIndex: response?.data?.current?.pollution?.aqius,
    });
  }

  async getDateTimesWhenParisWasMostPolluted() {
    const maxPollutionQuery = this.cityPollutionDataPointRepository
      .createQueryBuilder('cityPollutionDataPoints')
      .select('MAX(cityPollutionDataPoints.pollutionIndex)')
      .getQuery();

    const maxPollutionEntities = await this.cityPollutionDataPointRepository
      .createQueryBuilder('cityPollutionDataPoints')
      .where(`cityPollutionDataPoints.pollutionIndex = (${maxPollutionQuery})`)
      .getMany();

    return {
      pollutionIndex: maxPollutionEntities[0].pollutionIndex,
      dateTimes: maxPollutionEntities.map((entity) => entity.samplingDateTime),
    };
  }
}

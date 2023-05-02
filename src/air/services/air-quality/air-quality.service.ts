import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';

import { CityPollutionDataPoint } from '../../entities';

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
      return response.data;
    } catch (err) {
      this.handleAirQualityApiException(err);
    }
  }

  async getDateTimesWhenParisWasMostPolluted() {
    try {
      const maxPollutionQuery = this.cityPollutionDataPointRepository
        .createQueryBuilder('cityPollutionDataPoints')
        .select('MAX(cityPollutionDataPoints.pollutionIndex)')
        .getQuery();

      const maxPollutionEntities = await this.cityPollutionDataPointRepository
        .createQueryBuilder('cityPollutionDataPoints')
        .where(
          `cityPollutionDataPoints.pollutionIndex = (${maxPollutionQuery})`,
        )
        .getMany();

      return {
        pollutionIndex: maxPollutionEntities[0].pollutionIndex,
        dateTimes: maxPollutionEntities.map(
          (entity) => entity.samplingDateTime,
        ),
      };
    } catch (err) {
      this.handleDatabaseException(err, true);
    }
  }

  @Cron('01 * * * * *')
  async getParisPollutionDataPoint() {
    const parisLatitude = 48.856613;
    const parisLongitude = 2.352222;

    let response = null;

    try {
      response = await this.getNearestCityByCoordinates(
        parisLatitude,
        parisLongitude,
      );
    } catch (err) {
      this.handleAirQualityApiException(err);
    }

    if (response) {
      const cityPollutionDataPoint = new CityPollutionDataPoint();

      cityPollutionDataPoint.samplingDateTime = new Date();
      cityPollutionDataPoint.pollutionIndexRecordDateTime = new Date(
        response?.data?.current?.pollution?.ts,
      );
      cityPollutionDataPoint.city = response?.data?.city;
      cityPollutionDataPoint.state = response?.data?.state;
      cityPollutionDataPoint.country = response?.data?.country;
      cityPollutionDataPoint.pollutionIndex =
        response?.data?.current?.pollution?.aqius;

      try {
        await this.cityPollutionDataPointRepository.save(
          cityPollutionDataPoint,
        );
      } catch (err) {
        this.handleDatabaseException(err, false);
      }
    }
  }

  private handleDatabaseException(err: any, throwException: boolean) {
    // Log exception for auditing purposes
    console.log(err);

    if (throwException) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Something went wrong, please contact the administrator.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err,
        },
      );
    }
  }

  private handleAirQualityApiException(err: any) {
    // Log exception for auditing purposes
    console.log(err);

    throw new HttpException(
      {
        status: err.response?.status,
        error: err?.response?.data?.data,
      },
      err.response?.status,
      {
        cause: err?.response,
      },
    );
  }
}

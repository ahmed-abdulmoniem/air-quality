import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const axios = require('axios').default;

@Injectable()
export class AirQualityService {
  private readonly baseUrl = 'http://api.airvisual.com';

  constructor(private readonly configService: ConfigService) {}

  async getNearestCityByCoordinates(lat: number, lng: number) {
    const apiKey = this.configService.get<string>('IQAIR_API_KEY');

    const url = `${this.baseUrl}/v2/nearest_city?lat=${lat}&lon=${lng}&key=${apiKey}`;

    try {
      const response = await axios.get(url);

      return response.data;
    } catch (err) {
      throw err;
    }
  }
}

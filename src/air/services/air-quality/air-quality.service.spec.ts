import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CityPollutionDataPoint } from '../../entities';
import { AirQualityService } from './air-quality.service';

describe('AirQualityService', () => {
  let service: AirQualityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityService,
        ConfigService,
        {
          provide: getRepositoryToken(CityPollutionDataPoint),
          useFactory: jest.fn(() => ({
            metadata: {
              columns: [],
              relations: [],
            },
          })),
        },
      ],
    }).compile();

    service = module.get<AirQualityService>(AirQualityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

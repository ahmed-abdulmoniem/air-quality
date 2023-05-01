import { Test, TestingModule } from '@nestjs/testing';

import { AirQualityService } from '../../services';
import { AirQualityController } from './air-quality.controller';

describe('AirQualityController', () => {
  let controller: AirQualityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirQualityController],
      providers: [
        {
          provide: AirQualityService,
          useValue: {
            getNearestCityByCoordinates: jest.fn(),
            getDateTimesWhenParisWasMostPolluted: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AirQualityController>(AirQualityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

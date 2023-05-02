import { Test, TestingModule } from '@nestjs/testing';

import { AirQualityService } from '../../services';
import { AirQualityController } from './air-quality.controller';

describe('AirQualityController', () => {
  let controller: AirQualityController;
  let service: AirQualityService;

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
    service = module.get<AirQualityService>(AirQualityService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAirQuality Method', () => {
    it('should call getNearestCityByCoordinates method once from AirQualityService', () => {
      const mock = jest
        .spyOn(service, 'getNearestCityByCoordinates')
        .mockImplementation(() => Promise.resolve({}));

      controller.getAirQuality({ lat: 59.23, lng: 43.54 });

      expect(mock).toBeCalledTimes(1);
    });

    it('should call getNearestCityByCoordinates method from AirQualityService with correct params', () => {
      const mock = jest
        .spyOn(service, 'getNearestCityByCoordinates')
        .mockImplementation(() => Promise.resolve({}));

      controller.getAirQuality({ lat: 59.23, lng: 43.54 });

      expect(mock).toBeCalledWith(59.23, 43.54);
    });

    it('should return pollution information correctly', async () => {
      const result = {
        data: {
          current: {
            pollution: {
              aqi: 10,
              city: 'Paris',
            },
          },
        },
      };

      const expected = {
        Result: {
          Pollution: {
            aqi: 10,
            city: 'Paris',
          },
        },
      };

      jest
        .spyOn(service, 'getNearestCityByCoordinates')
        .mockImplementation(() => Promise.resolve(result));

      const actual = await controller.getAirQuality({ lat: 59.23, lng: 43.54 });

      expect(actual).toStrictEqual(expected);
    });
  });

  describe('getParisMostPollutedTime Method', () => {
    it('should call getDateTimesWhenParisWasMostPolluted method once from AirQualityService', () => {
      const mock = jest
        .spyOn(service, 'getDateTimesWhenParisWasMostPolluted')
        .mockImplementation(() => Promise.resolve(null));

      controller.getParisMostPollutedTime();

      expect(mock).toBeCalledTimes(1);
    });

    it('should return correct results from getDateTimesWhenParisWasMostPolluted method as is', async () => {
      const expected = {
        pollutionIndex: 79,
        dateTimes: [
          new Date('2023-05-01T08:09:01.000Z'),
          new Date('2023-05-01T08:10:01.000Z'),
        ],
      };

      jest
        .spyOn(service, 'getDateTimesWhenParisWasMostPolluted')
        .mockImplementation(() => Promise.resolve(expected));

      const actual = await controller.getParisMostPollutedTime();

      expect(actual).toStrictEqual(expected);
    });
  });
});

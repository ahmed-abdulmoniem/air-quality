import { HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CityPollutionDataPoint } from '../../entities';
import { AirQualityService } from './air-quality.service';

const axios = require('axios');

jest.mock('axios');

describe('AirQualityService', () => {
  const baseUrl = 'http://api.airvisual.com';
  let service: AirQualityService;
  let configService: ConfigService;
  let cityPollutionDataPointRepository: Repository<CityPollutionDataPoint>;

  const data = [
    {
      pollutionIndex: 10,
      samplingDateTime: new Date('2023-05-01T08:09:01.000Z'),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirQualityService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              // this is being super extra, in the case that you need multiple keys with the `get` method
              if (key === 'IQAIR_API_KEY') {
                return 123;
              }
              return null;
            }),
          },
        },
        {
          provide: getRepositoryToken(CityPollutionDataPoint),
          useValue: {
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AirQualityService>(AirQualityService);
    configService = module.get<ConfigService>(ConfigService);
    cityPollutionDataPointRepository = module.get<
      Repository<CityPollutionDataPoint>
    >(getRepositoryToken(CityPollutionDataPoint));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNearestCityByCoordinates Method', () => {
    it('should call ConfigService to resolve API Key', () => {
      const lat = 50.56;
      const lng = 67.43;

      axios.get.mockResolvedValueOnce({});

      service.getNearestCityByCoordinates(lat, lng);

      expect(configService.get).toHaveBeenCalledWith('IQAIR_API_KEY');
    });

    it('should call IQAir API with correct URL', () => {
      const lat = 50.56;
      const lng = 67.43;
      const apiKey = '123';

      axios.get.mockResolvedValueOnce({});

      service.getNearestCityByCoordinates(lat, lng);

      expect(axios.get).toHaveBeenCalledWith(
        `${baseUrl}/v2/nearest_city?lat=${lat}&lon=${lng}&key=${apiKey}`,
      );
    });

    it('should return correct response from axios', async () => {
      const lat = 50.56;
      const lng = 67.43;

      const result = {
        data: {
          pollution: {
            index: 10,
            city: 'Paris',
          },
        },
      };

      const expected = {
        pollution: {
          index: 10,
          city: 'Paris',
        },
      };

      axios.get.mockResolvedValueOnce(result);

      const actual = await service.getNearestCityByCoordinates(lat, lng);

      expect(actual).toStrictEqual(expected);
    });

    it('should throw exception if axios throws exception from IQAir', async () => {
      const lat = 50.56;
      const lng = 67.43;

      const error = {
        response: {
          status: 500,
          data: {
            data: 'Error happened in the server',
          },
        },
      };

      axios.get.mockRejectedValueOnce(error);

      await expect(() =>
        service.getNearestCityByCoordinates(lat, lng),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getDateTimesWhenParisWasMostPolluted Method', () => {
    it('should call createQueryBuilder twice from cityPollutionDataPointRepository', async () => {
      const createQueryBuilder: any = {
        select: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getQuery: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        where: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getMany: jest.fn().mockImplementationOnce(() => {
          return data;
        }),
      };

      jest
        .spyOn(cityPollutionDataPointRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      await service.getDateTimesWhenParisWasMostPolluted();

      expect(
        cityPollutionDataPointRepository.createQueryBuilder,
      ).toBeCalledTimes(2);
    });

    it('should call select once from cityPollutionDataPointRepository', async () => {
      const createQueryBuilder: any = {
        select: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getQuery: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        where: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getMany: jest.fn().mockImplementationOnce(() => {
          return data;
        }),
      };

      jest
        .spyOn(cityPollutionDataPointRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      await service.getDateTimesWhenParisWasMostPolluted();

      expect(createQueryBuilder.select).toBeCalledTimes(1);
    });

    it('should call getQuery once from cityPollutionDataPointRepository', async () => {
      const createQueryBuilder: any = {
        select: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getQuery: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        where: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getMany: jest.fn().mockImplementationOnce(() => {
          return data;
        }),
      };

      jest
        .spyOn(cityPollutionDataPointRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      await service.getDateTimesWhenParisWasMostPolluted();

      expect(createQueryBuilder.getQuery).toBeCalledTimes(1);
    });

    it('should call where once from cityPollutionDataPointRepository', async () => {
      const createQueryBuilder: any = {
        select: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getQuery: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        where: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getMany: jest.fn().mockImplementationOnce(() => {
          return data;
        }),
      };

      jest
        .spyOn(cityPollutionDataPointRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      await service.getDateTimesWhenParisWasMostPolluted();

      expect(createQueryBuilder.where).toBeCalledTimes(1);
    });

    it('should call getMany once from cityPollutionDataPointRepository', async () => {
      const createQueryBuilder: any = {
        select: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getQuery: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        where: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getMany: jest.fn().mockImplementationOnce(() => {
          return data;
        }),
      };

      jest
        .spyOn(cityPollutionDataPointRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      await service.getDateTimesWhenParisWasMostPolluted();

      expect(createQueryBuilder.getMany).toBeCalledTimes(1);
    });

    it('should return results from cityPollutionDataPointRepository', async () => {
      const expected = {
        pollutionIndex: 10,
        dateTimes: [new Date('2023-05-01T08:09:01.000Z')],
      };

      const createQueryBuilder: any = {
        select: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getQuery: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        where: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getMany: jest.fn().mockImplementationOnce(() => {
          return data;
        }),
      };

      jest
        .spyOn(cityPollutionDataPointRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const actual = await service.getDateTimesWhenParisWasMostPolluted();

      expect(actual).toStrictEqual(expected);
    });

    it('should throw exception if cityPollutionDataPointRepository failed to get data from database', async () => {
      const expected = {
        pollutionIndex: 10,
        dateTimes: [new Date('2023-05-01T08:09:01.000Z')],
      };

      const createQueryBuilder: any = {
        select: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getQuery: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        where: jest.fn().mockImplementation(() => {
          return createQueryBuilder;
        }),
        getMany: jest.fn().mockImplementationOnce(() => {
          throw new Error();
        }),
      };

      jest
        .spyOn(cityPollutionDataPointRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      await expect(() =>
        service.getDateTimesWhenParisWasMostPolluted(),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getParisPollutionDataPoint Method', () => {
    it('should call ConfigService to resolve API Key', () => {
      axios.get.mockResolvedValueOnce({});

      service.getParisPollutionDataPoint();

      expect(configService.get).toHaveBeenCalledWith('IQAIR_API_KEY');
    });

    it('should call IQAir API with correct URL', () => {
      const parisLatitude = 48.856613;
      const parisLongitude = 2.352222;
      const apiKey = '123';

      axios.get.mockResolvedValueOnce({});

      service.getParisPollutionDataPoint();

      expect(axios.get).toHaveBeenCalledWith(
        `${baseUrl}/v2/nearest_city?lat=${parisLatitude}&lon=${parisLongitude}&key=${apiKey}`,
      );
    });

    it('should call save method on CityPollutionDataPoint', async () => {
      axios.get.mockResolvedValueOnce({
        data: {
          data: {
            current: {
              city: '',
              state: '',
              country: '',
              pollution: {
                index: 10,
                city: 'Paris',
                ts: '',
              },
            },
          },
        },
      });

      await service.getParisPollutionDataPoint();

      expect(cityPollutionDataPointRepository.save).toBeCalledTimes(1);
    });

    it('should throw exception if axios throws exception from IQAir', async () => {
      const error = {
        response: {
          status: 500,
          data: {
            data: 'Error happened in the server',
          },
        },
      };

      axios.get.mockRejectedValueOnce(error);

      await expect(() => service.getParisPollutionDataPoint()).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw exception if cityPollutionDataPointRepository.save throws exception from database', async () => {
      const error = {
        response: {
          status: 500,
          data: {
            data: 'Error happened in the db',
          },
        },
      };

      axios.get.mockResolvedValueOnce({
        data: {
          data: {
            current: {
              city: '',
              state: '',
              country: '',
              pollution: {
                index: 10,
                city: 'Paris',
                ts: '',
              },
            },
          },
        },
      });

      jest
        .spyOn(cityPollutionDataPointRepository, 'save')
        .mockImplementation(() => Promise.reject(error));

      await expect(() => service.getParisPollutionDataPoint()).not.toThrow(
        HttpException,
      );
    });
  });
});

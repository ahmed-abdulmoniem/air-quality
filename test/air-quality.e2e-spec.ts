import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('AirQualityController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('/air-quality (GET)', () => {
    it('should return 400 if no latitude or longitude passed', () => {
      return request(app.getHttpServer())
        .get('/air-quality')
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'Latitude (lat) should not be null or undefined',
            'Latitude format is not correct',
            'Longitude (lng) should not be null or undefined',
            'Longitude format is not correct',
          ],
          error: 'Bad Request',
        });
    });

    it('should return 400 if no latitude passed', () => {
      return request(app.getHttpServer())
        .get('/air-quality?lng=50.32')
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'Latitude (lat) should not be null or undefined',
            'Latitude format is not correct',
          ],
          error: 'Bad Request',
        });
    });

    it('should return 400 if no longitude passed', () => {
      return request(app.getHttpServer())
        .get('/air-quality?lat=50.32')
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'Longitude (lng) should not be null or undefined',
            'Longitude format is not correct',
          ],
          error: 'Bad Request',
        });
    });

    it('should return 400 if non-correct latitude passed', () => {
      return request(app.getHttpServer())
        .get('/air-quality?lng=50.32&lat=777')
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Latitude format is not correct'],
          error: 'Bad Request',
        });
    });

    it('should return 400 if non-correct longitude passed', () => {
      return request(app.getHttpServer())
        .get('/air-quality?lat=50.42&lng=777')
        .expect(400)
        .expect({
          statusCode: 400,
          message: ['Longitude format is not correct'],
          error: 'Bad Request',
        });
    });

    it('should return 200 if correct longitude and latitude passed', () => {
      return request(app.getHttpServer())
        .get('/air-quality?lat=34&lng=136')
        .expect(200);
    });
  });

  describe('/air-quality/paris-most-polluted-time (GET)', () => {
    it('should return 200', () => {
      return request(app.getHttpServer())
        .get('/air-quality/paris-most-polluted-time')
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});

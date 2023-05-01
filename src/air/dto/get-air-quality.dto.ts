import { IsDefined, IsLatitude, IsLongitude } from 'class-validator';

export class GetAirQualityDto {
  @IsDefined({ message: 'Latitude (lat) should not be null or undefined' })
  @IsLatitude({ message: 'Latitude format is not correct' })
  lat: number;

  @IsDefined({ message: 'Longitude (lng) should not be null or undefined' })
  @IsLongitude({ message: 'Longitude format is not correct' })
  lng: number;
}

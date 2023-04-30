import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CityPollutionDataPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  samplingDateTime: Date;

  @Column()
  pollutionIndexRecordDateTime: Date;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @Column()
  pollutionIndex: number;
}

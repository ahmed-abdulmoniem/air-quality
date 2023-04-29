import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AirModule } from './air/air.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    AirModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

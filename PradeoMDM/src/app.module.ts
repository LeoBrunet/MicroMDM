import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DeviceModule } from './devices/device.module';
import { ApplicationModule } from './applications/application.module';
import { MdmModule } from './mdm/mdm.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'oui',
      database: process.env.DB_DATABASE || 'mdm_database',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    DeviceModule,
    ApplicationModule,
    MdmModule,
  ],
})
export class AppModule {}
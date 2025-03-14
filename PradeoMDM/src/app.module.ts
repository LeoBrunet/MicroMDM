import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { DeviceModule } from './devices/device.module';
import { ApplicationModule } from './applications/application.module';
import { WebhookModule } from './common/webhooks/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT', 5000),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS', 5),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_DATABASE', 'mdm_database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
    }),
    DeviceModule,
    ApplicationModule,
    WebhookModule
  ],
})
export class AppModule {}
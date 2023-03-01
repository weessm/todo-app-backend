import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configServive: ConfigService) => ({
        type: 'mysql',
        host: configServive.get('DB_HOST', 'localhost'),
        port: Number(configServive.get('DB_PORT', 3306)),
        username: configServive.get('DB_USERNAME', 'root'),
        password: configServive.get('DB_PASSWORD', ''),
        database: configServive.get('DB_DATABASE', 'todoapp'),
        entities: [],
        synchronize: true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

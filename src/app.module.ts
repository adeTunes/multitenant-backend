import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TenantModule } from './tenant/tenant.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      async useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt.secret'),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      async useFactory(configService: ConfigService) {
        return {
          uri: configService.get('database.connectionString'),
        };
      },
      inject: [ConfigService],
    }),
    TenantModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}

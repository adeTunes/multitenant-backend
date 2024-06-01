import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TenantsMiddlware } from 'src/middlewares/tenants.middleware';
import { tenantConnectionProvider } from 'src/providers/tenant-connection.provider';
import { tenantmodelsProvider } from 'src/providers/tenant-model.provider';
import { TenantModule } from 'src/tenant/tenant.module';
import { MailService } from 'src/services/mail.service';

@Module({
  controllers: [AuthController],
  providers: [
    MailService,
    AuthService,
    tenantConnectionProvider,
    tenantmodelsProvider.user,
    tenantmodelsProvider.refreshToken,
    tenantmodelsProvider.verifyEmailToken,
  ],
  imports: [TenantModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddlware).forRoutes(AuthController);
  }
}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { tenantConnectionProvider } from 'src/providers/tenant-connection.provider';
import { tenantmodelsProvider } from 'src/providers/tenant-model.provider';
import { TenantsMiddlware } from 'src/middlewares/tenants.middleware';
import { TenantModule } from 'src/tenant/tenant.module';

@Module({
  controllers: [UserController],
  providers: [UserService, tenantConnectionProvider, tenantmodelsProvider.user],
  imports: [TenantModule]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddlware).forRoutes(UserController);
  }
}

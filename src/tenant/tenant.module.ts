import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from './tenant.schema';
import { TenantsMiddlware } from 'src/middlewares/tenants.middleware';

@Module({
  imports: [
    
    MongooseModule.forFeature([
      {
        name: Tenant.name,
        schema: TenantSchema,
      },
    ]),
  ],
  controllers: [TenantController],
  providers: [TenantService],
  exports: [TenantService],
})
export class TenantModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddlware).forRoutes(TenantController);
  }
}


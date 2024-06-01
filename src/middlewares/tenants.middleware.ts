import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TenantService } from 'src/tenant/tenant.service';
import { decrypt } from 'src/utils/decrypt';

@Injectable()
export class TenantsMiddlware implements NestMiddleware {
  constructor(private readonly tenantService: TenantService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    let tenant = req.headers['x-req-src'];
    if (!tenant) throw new BadRequestException('X-REQ-SRC not provided');
    let decryptedData: { alias: string };
    try {
      decryptedData = JSON.parse(decrypt(tenant));
      if (!decryptedData.alias)
        throw new BadRequestException('Invalid X-REQ-SRC');
      const tenantExists = await this.tenantService.isTenantExist(
        decryptedData.alias,
      );
      if (!tenantExists) throw new BadRequestException('Tenant does not exist');
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Invalid X-REQ-SRC');
    }

    req['tenantAlias'] = decryptedData.alias;
    next();
  }
}

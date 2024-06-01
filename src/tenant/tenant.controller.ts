import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Req,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { Request } from 'express';

@Controller('')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get('company-details')
  getCompanyDetails(@Req() req: Request) {
    return this.tenantService.getCompanyDetails(req['tenantAlias']);
  }
}

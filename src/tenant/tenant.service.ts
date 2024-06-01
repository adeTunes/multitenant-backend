import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from './tenant.schema';

@Injectable()
export class TenantService {
  constructor(@InjectModel(Tenant.name) private TenantModel: Model<Tenant>) {}

  async getCompanyDetails(alias: string) {
    const companyDetails = await this.TenantModel.findOne({
      company_alias: alias,
    });

    if (!companyDetails) throw new BadRequestException('Invalid company alias');
    const { company_alias, company_logo, company_name } = companyDetails;
    return {
      alias: company_alias,
      logo: company_logo,
      name: company_name,
    };
  }

  async isTenantExist(alias: string) {
    const companyDetails = await this.TenantModel.findOne({
      company_alias: alias,
    });

    return !!companyDetails;
  }
}

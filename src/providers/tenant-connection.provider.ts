import { InternalServerErrorException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

export const TENANT_CONNECTION_TOKEN = 'TENANT_CONNECTION';

export const tenantConnectionProvider = {
  provide: TENANT_CONNECTION_TOKEN,
  async useFactory(request, connection: Connection) {
    if (!request.tenantAlias)
      throw new InternalServerErrorException('Apply request tenant ID');
    return connection.useDb(
      `tenant_${(request.tenantAlias as string).toUpperCase()}`,
    );
  },
  inject: [REQUEST, getConnectionToken()],
};

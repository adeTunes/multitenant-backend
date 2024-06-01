import { Connection } from 'mongoose';
import { TENANT_CONNECTION_TOKEN } from './tenant-connection.provider';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import {
  RefreshToken,
  RefreshTokenSchema,
} from 'src/auth/schemas/refresh-token.schema';
import {
  VerifyEmailToken,
  VerifyTokenSchema,
} from 'src/auth/schemas/verify-email.schema';

export enum TENANT_MODEL {
  USER_MODEL = 'USER_MODEL',
  REFRESH_TOKEN_MODEL = 'REFRESH_TOKEN_MODEL',
  VERIFY_EMAIL_TOKEN_MODEL = 'VERIFY_EMAIL_TOKEN_MODEL',
}

export const tenantmodelsProvider = {
  user: {
    provide: TENANT_MODEL.USER_MODEL,
    async useFactory(tenantConnetion: Connection) {
      return tenantConnetion.model(User.name, UserSchema);
    },
    inject: [TENANT_CONNECTION_TOKEN],
  },
  refreshToken: {
    provide: TENANT_MODEL.REFRESH_TOKEN_MODEL,
    async useFactory(tenantConnetion: Connection) {
      return tenantConnetion.model(RefreshToken.name, RefreshTokenSchema);
    },
    inject: [TENANT_CONNECTION_TOKEN],
  },
  verifyEmailToken: {
    provide: TENANT_MODEL.VERIFY_EMAIL_TOKEN_MODEL,
    async useFactory(tenantConnetion: Connection) {
      return tenantConnetion.model(VerifyEmailToken.name, VerifyTokenSchema);
    },
    inject: [TENANT_CONNECTION_TOKEN],
  },
};

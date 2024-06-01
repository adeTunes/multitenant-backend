import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { TENANT_MODEL } from 'src/providers/tenant-model.provider';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(TENANT_MODEL.USER_MODEL) private UserModel: Model<User>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.UserModel.findById(payload.userId);
      if (!user) throw new UnauthorizedException();
      request['user'] = user;
    } catch (error) {
      Logger.error(error.message);
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    return req.headers.authorization?.split(' ')?.[1];
  }
}

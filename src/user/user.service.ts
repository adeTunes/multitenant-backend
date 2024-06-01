import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { TENANT_MODEL } from 'src/providers/tenant-model.provider';

@Injectable()
export class UserService {
  constructor(
    @Inject(TENANT_MODEL.USER_MODEL) private UserModel: Model<User>,
  ) {}

  async getUsers() {
    const users = await this.UserModel.find();

    return users;
  }
}

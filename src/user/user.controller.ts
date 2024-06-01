import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/auth/schemas/user.schema';

@UseGuards(AuthGuard)
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user-details')
  getUserDetails(@GetUser() user: User) {
    return user;
  }

  @Get('users')
  getUsers() {
    return this.userService.getUsers();
  }
}

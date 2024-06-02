import { Controller, Get } from '@nestjs/common';
import { encrypt } from './utils/encrypt';
import * as bcrypt from 'bcrypt';

@Controller()
export class AppController {
  @Get()
  async getHello() {
    const hash = await bcrypt.hash('password@1', 10);
    console.log(hash);
    return 'Hello world';
  }
}

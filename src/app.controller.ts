import { Controller, Get } from '@nestjs/common';
import { encrypt } from './utils/encrypt';

@Controller()
export class AppController {
  @Get()
  getHello() {
    console.log(encrypt(JSON.stringify({ alias: 'linkedin' })));
    return 'Hello world';
  }
}

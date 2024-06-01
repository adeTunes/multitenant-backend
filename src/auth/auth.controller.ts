import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { VerifyTokenDto } from './dto/verify-token.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @Post('signin')
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }

  @Post('refresh-token')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.token);
  }

  @Post('verify-token')
  verifyToken(@Body() verifyTokenDto: VerifyTokenDto) {
    return this.authService.verifyToken(
      verifyTokenDto.token,
      verifyTokenDto.email,
    );
  }
}

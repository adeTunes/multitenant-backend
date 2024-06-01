import { IsEmail, IsNumber } from 'class-validator';

export class VerifyTokenDto {
  @IsNumber()
  token: number;

  @IsEmail()
  email: string;
}

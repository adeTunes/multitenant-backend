import { IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain at least a number',
  })
  password: string;

  @IsString()
  @IsOptional()
  profile_picture: string;
}

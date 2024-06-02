import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Connection, Model } from 'mongoose';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { RefreshToken } from './schemas/refresh-token.schema';
import { TENANT_MODEL } from 'src/providers/tenant-model.provider';
import { randomInt } from 'crypto';
import { VerifyEmailToken } from './schemas/verify-email.schema';
import { MailService } from 'src/services/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(TENANT_MODEL.USER_MODEL) private UserModel: Model<User>,
    @Inject(TENANT_MODEL.REFRESH_TOKEN_MODEL)
    private RefreshTokenModel: Model<RefreshToken>,
    @Inject(TENANT_MODEL.VERIFY_EMAIL_TOKEN_MODEL)
    private VerifyEmailTokenModel: Model<VerifyEmailToken>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signup(signUpDto: SignUpDto) {
    const user = await this.UserModel.findOne({ email: signUpDto.email });
    if (user) throw new BadRequestException('Email already in use');

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    await this.UserModel.create({ ...signUpDto, password: hashedPassword });
  }

  async signin(signInDto: SignInDto) {
    const user = await this.UserModel.findOne({ email: signInDto.email });
    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const isPasswordMatched = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid Credentials');

    if (!user.is_verified) {
      try {
        const existingToken = await this.VerifyEmailTokenModel.findOne({
          userId: user._id,
        });

        if (existingToken) {
          const token = randomInt(100000, 999999);
          existingToken.token = token;
          existingToken.expiryDate = new Date(Date.now() + 15 * 60 * 1000);
          await existingToken.save();

          await this.mailService.sendVerificationEmail(user.email, token);
        } else {
          const token = randomInt(100000, 999999);
          const expiryDate = new Date(Date.now() + 15 * 60 * 1000);

          await this.VerifyEmailTokenModel.create({
            expiryDate,
            userId: user._id,
            token,
          });

          await this.mailService.sendVerificationEmail(user.email, token);
        }
        return { is_verified: false };
      } catch (error) {
        console.log(error.message);
        throw new InternalServerErrorException('Could not process the request');
      }
    }

    return this.generateUserToken(user._id);
  }

  async verifyToken(token: number, email: string) {
    const user = await this.UserModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid email');
    const storedToken = await this.VerifyEmailTokenModel.findOneAndDelete({
      token,
      userId: user._id,
      expiryDate: { $gte: new Date() },
    });

    if (!storedToken) throw new UnauthorizedException('Token is invalid');
    user.is_verified = true;
    await user.save();
    return this.generateUserToken(storedToken.userId);
  }

  async refreshTokens(token: string) {
    const storedToken = await this.RefreshTokenModel.findOneAndDelete({
      token,
      expiryDate: { $gte: new Date() },
    });

    if (!storedToken)
      throw new UnauthorizedException('Refresh Token is invalid');
    return this.generateUserToken(storedToken.userId);
  }

  async generateUserToken(userId) {
    const access_token = this.jwtService.sign({ userId }, { expiresIn: '24h' });
    const refresh_token = uuidv4();
    await this.storeRefreshToken(userId, refresh_token);
    return {
      access_token,
      refresh_token,
    };
  }

  async storeRefreshToken(userId: mongoose.Types.ObjectId, token: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    await this.RefreshTokenModel.create({ userId, expiryDate, token });
  }
}

import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Res } from '@nestjs/common/decorators/http';
import { Req } from '@nestjs/common/decorators/http';
import { Response, Request, response } from 'express';
import { UserDto } from './user.dto';
import { LoginDto } from './login.dto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email/email.service';
import { OtpService } from './otp/otp.service';
import { ChangePassDto } from './change-pass.dto';

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private configService: ConfigService,
    private otpService: OtpService,
  ) {}

  @Post('register')
  async register(@Body() user: UserDto) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const newUser = await this.appService.create({
      ...user,
      password: hashedPassword,
    });
    const { password, ...result } = newUser;
    return result;
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.appService.findOne({ email: loginDto.email });
    if (!user) {
      throw new BadRequestException('invalid user');
    }
    if (!(await bcrypt.compare(loginDto.password, user.password))) {
      throw new BadRequestException('invalid password ');
    }
    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true });

    const token = this.otpService.getToken();
    this.emailService.sendMail({
      to: loginDto.email,
      subject: 'Email confirmation',
      text: `Your email confirmation otp is: ${token}`,
    });
    return {
      message: 'success',
    };
  }

  @Post('confirmOtp')
  async confirmEmailOtp(@Body('otp') token: string) {
    const isValid = this.otpService.confirmOtp(token);
    if (!isValid) {
      throw new BadRequestException('OTP expired');
    }
    return { message: 'OTP confirmed' };
  }

  @Get('user')
  async user(@Req() request: Request) {
    try {
      const jwtToken = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(jwtToken);
      if (!data) {
        throw new UnauthorizedException();
      }
      const user = await this.appService.findOne({ id: data['id'] });
      const { password, ...result } = user;
      return result;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('changePass')
  async changePass(@Body() changePass: ChangePassDto, @Req() request: Request) {
    try {
      // first we validate the users JWT
      const jwtToken = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(jwtToken);
      if (!data) {
        throw new UnauthorizedException();
      }

      //validate the old password
      const user = await this.appService.findOne({ id: data['id'] });
      if (!(await bcrypt.compare(changePass.oldPassword, user.password))) {
        throw new BadRequestException('invalid password ');
      }

      // then lastly we update the database with the updated password
      if (changePass.newPassword != changePass.retypeNewPassword) {
        throw new BadRequestException('Password doesnot match');
      }
      const hashedPassword = await bcrypt.hash(changePass.newPassword, 12);
      await this.appService.update(user.id, { password: hashedPassword });

      return {
        message: 'Password changed successfully',
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}

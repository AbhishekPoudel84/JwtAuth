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
import { UserDto } from './user/user.dto';
import { LoginDto } from './login.dto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email/email.service';
import { OtpService } from './otp/otp.service';
import { ChangePassDto } from './change-pass.dto';
import { ReqResetPassDto } from './req-reset-pass.dto';
import { ResetPassDto } from './reset-pass.dto';
import { User } from './user/user.entity';

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

  @Post('confirm-otp')
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

  @Post('change-pass')
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

  @Post('req-reset-pass')
  async reqResetPass(@Body() reqResetPass: ReqResetPassDto) {
    //first we validate the users email
    const user = await this.appService.findOne({ email: reqResetPass.email });
    if (!user) {
      throw new BadRequestException('Invalid User');
    }

    const token = this.otpService.getToken();
    this.emailService.sendMail({
      to: reqResetPass.email,
      subject: 'Reset Password Otp',
      text: `Your reset password OTP is: ${token}`,
    });
    return {
      message: 'The otp for reset-pass is sent.',
    };
  }

  //get email
  @Post('reset-pass')
  async resetPass(@Body() resetPass: ResetPassDto) {
    try {
      const user = await this.appService.findOne({ email: resetPass.email });
      if (!user) {
        throw new BadRequestException('Invalid User');
      }

      // otp validate
      const isValid = await this.otpService.confirmOtp(resetPass.otp);
      if (!isValid) {
        throw new BadRequestException('OTP is not valid.');
      }

      //new password
      if (resetPass.newPassword != resetPass.retypeNewPassword) {
        throw new BadRequestException('Password doesnot match');
      }
      const hashedPassword = await bcrypt.hash(resetPass.newPassword, 12);
      await this.appService.update(user.id, { password: hashedPassword });

      return {
        message: 'Password reset successfully',
      };
    } catch (e) {
      return 'not found';
    }
  }

  // @Post('message')
  // async resetPass(@Body() resetPass: ResetPassDto)
}

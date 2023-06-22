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

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService,
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
    return {
      message: 'success',
    };
  }

  @Get('user')
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);
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
}

import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JWTService {
  constructor(private jwtService: JwtService) {}

  signAsync(data) {
    return this.jwtService.signAsync(data);
  }

  verifyAsync(token) {
    return this.jwtService.verifyAsync(token);
  }
}

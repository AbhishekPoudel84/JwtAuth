import {
  Controller,
  Post,
  UnauthorizedException,
  UseInterceptors,
  forwardRef,
} from "@nestjs/common";
import { Req } from "@nestjs/common/decorators/http";
import { Request } from "express";
import { FileService } from "./file.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { AppService } from "src/app.service";
import { JWTService } from "src/jwt/jwt-service";
import { Inject } from "@nestjs/common/decorators";

@Controller("file")
export class FileController {
  constructor(
    // @Inject(forwardRef(() => JWTService))
    private readonly jwtService: JWTService,
    private readonly fileService: FileService,
    private readonly appService: AppService
  ) {}

  @Post("/upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    })
  )
  async uploadFile(@Req() request: Request) {
    const fileName = request.file.originalname;
    const jwtToken = request.cookies["jwt"];
    const data = await this.jwtService.verifyAsync(jwtToken);
    if (!data) {
      throw new UnauthorizedException();
    }
    const fromUser = await this.appService.findOne({ id: data["id"] });
    const newData = {
      fileName: fileName,
      fromUser: fromUser,
    };
    const saveFileUpload = await this.fileService.saveFileUpload({
      ...newData,
    });
    return saveFileUpload;
  }
}

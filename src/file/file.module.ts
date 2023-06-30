import { Module, forwardRef } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileController } from "./file.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileUpload } from "./entities/file.entity";
import { JWTModule } from "src/jwt/jwt-module";
import { AppModule } from "src/app.module";
import { MessagesModule } from "src/messages/messages.module";

@Module({
  imports: [
    forwardRef(() => AppModule),
    forwardRef(() => JWTModule),
    // forwardRef(() => MessagesModule),
    TypeOrmModule.forFeature([FileUpload]),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}

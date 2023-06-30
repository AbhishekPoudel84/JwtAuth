import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express/interfaces";
//import { ServeStaticModule } from '@nestjs/serve-static';
import { MainModule } from "./main.module";
import * as path from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.useStaticAssets(path.join(__dirname, "../uploads"));
  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });
  await app.listen(8000);
}
bootstrap();

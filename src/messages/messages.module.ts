import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { AppModule } from 'src/app.module';
import { JWTModule } from 'src/jwt/jwt-module';

@Module({
  imports: [AppModule, JWTModule],
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}

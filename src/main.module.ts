import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { AppModule } from './app.module';

@Module({
  imports: [MessagesModule, AppModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class MainModule {}

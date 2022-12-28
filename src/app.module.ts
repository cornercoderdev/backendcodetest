import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BusinfoModule } from './api/businfo/businfo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BusinfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

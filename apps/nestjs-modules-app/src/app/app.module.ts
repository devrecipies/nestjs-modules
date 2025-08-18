import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FcmModule } from '@devrecipies/nestjs-modules';

@Module({
  imports: [
    FcmModule.forRoot({
      config: {
        projectId: process.env['FIREBASE_PROJECT_ID'] || '',
        clientEmail: process.env['FIREBASE_CLIENT_EMAIL'] || '',
        privateKey: process.env['FIREBASE_PRIVATE_KEY'] || '',
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

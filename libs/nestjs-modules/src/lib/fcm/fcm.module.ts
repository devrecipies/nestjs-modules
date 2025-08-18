import { DynamicModule, Module } from '@nestjs/common';
import { FcmService } from './fcm.service';
import { FcmModuleOptions } from './interfaces/fcm-config.interface';

@Module({})
export class FcmModule {
  static forRoot(options: FcmModuleOptions): DynamicModule {
    return {
      module: FcmModule,
      providers: [
        {
          provide: 'FCM_CONFIG',
          useValue: options.config,
        },
        {
          provide: FcmService,
          useFactory: (config) => new FcmService(config),
          inject: ['FCM_CONFIG'],
        },
      ],
      exports: [FcmService],
      global: true,
    };
  }
}
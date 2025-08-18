import { Injectable, Module, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private readonly logger = new Logger(LoggerService.name);

  log(message: string, context?: string) {
    this.logger.log(message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, context);
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, context);
  }
}

@Injectable()
export class UtilsService {
  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

@Module({
  providers: [LoggerService, UtilsService],
  exports: [LoggerService, UtilsService],
})
export class DevrecipiesNestjsModulesModule {}

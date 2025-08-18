# Usage Example

## Installation

```bash
npm install @devrecipies/nestjs-modules
```

## Import in your NestJS project

### Method 1: Import the entire module

```typescript
import { Module } from '@nestjs/common';
import { DevrecipiesNestjsModulesModule } from '@devrecipies/nestjs-modules';

@Module({
  imports: [DevrecipiesNestjsModulesModule],
})
export class AppModule {}
```

### Method 2: Import specific services

```typescript
import { Module } from '@nestjs/common';
import { LoggerService, UtilsService } from '@devrecipies/nestjs-modules';

@Module({
  providers: [LoggerService, UtilsService],
  exports: [LoggerService, UtilsService],
})
export class AppModule {}
```

## Using the services

### LoggerService

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService } from '@devrecipies/nestjs-modules';

@Injectable()
export class MyService {
  constructor(private readonly loggerService: LoggerService) {}

  doSomething() {
    this.loggerService.log('This is a test log message');
    this.loggerService.error('This is an error message');
    this.loggerService.warn('This is a warning message');
  }
}
```

### UtilsService

```typescript
import { Injectable } from '@nestjs/common';
import { UtilsService } from '@devrecipies/nestjs-modules';

@Injectable()
export class MyService {
  constructor(private readonly utilsService: UtilsService) {}

  async doSomething() {
    // Generate UUID
    const id = this.utilsService.generateUUID();
    console.log('Generated ID:', id);

    // Validate email
    const isValid = this.utilsService.isValidEmail('test@example.com');
    console.log('Is valid email:', isValid);

    // Add delay
    await this.utilsService.delay(1000);
    console.log('Waited 1 second');
  }
}
```

## TypeScript Support

This package includes full TypeScript declarations, so you'll get proper intellisense and type checking in your IDE.

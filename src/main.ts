import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const logger = new Logger('Main.ts');

  logger.log('>>>>> Testing with Nest framework <<<<<<');
  const app = await NestFactory.createApplicationContext(AppModule);
  // although we have utilized the NEST Module to get the AppService Object but basic object do work too.
  const appService = app.get(AppService);
  await appService.getHello('CP');

  logger.log('>>>>>> Now testing with basic object usage >>>>>>');
  const appService1 = new AppService();
  await appService1.getHello('AWESOME');


  await app.close();
}
bootstrap();

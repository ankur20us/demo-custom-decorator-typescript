import { Injectable } from '@nestjs/common';
import { LogMe } from './shared/logme.decorator';

@Injectable()
export class AppService {

  @LogMe({
    logArgumentsAfter: true,
    logArgumentsBefore: true,
    logResult: true
  })
  getHello(name: string): Promise<string> | string {
    return Promise.resolve(`Hello ${name}`);
  }
}

import { applyDecorators, Logger } from '@nestjs/common';
import { afterMethod, beforeMethod } from 'kaop-ts';
import { from } from 'rxjs';
import to from 'await-to-js';

const logger = new Logger('LogMe', true);

const tc = async <T>(p: Promise<T>, errorExt?: any): Promise<[Error, T]> =>
  to(p, errorExt);

class LogMeRequestDTO {
  logArgumentsBefore?: boolean = false;
  logResult?: boolean = false;
  logArgumentsAfter?: boolean = false;
}

export const LogMe = (options: LogMeRequestDTO = {}) => {
  const before = beforeMethod((meta) => {
    /**
     * The session for current thread context is being set in session-middleware
     */
    const printArray: string[] = [
      'ENTER LOGME',
      meta.target.constructor.name,
      meta.method.name,
    ];

    if (options?.logArgumentsBefore && meta?.args?.length > 0)
      printArray.push(JSON.stringify(meta.args));
    logger.debug(printArray.join(' -> '));
  });

  const after = afterMethod(async (meta) => {
    /**
     * The session for current thread context is being set in session-middleware
     */

    const printArray: string[] = [
      'EXIT LOGME',
      meta.target.constructor.name,
      meta.method.name,
    ];
    let err;
    let finalResult;

    if (options?.logArgumentsAfter && meta?.args?.length > 0)
      printArray.push(JSON.stringify(meta.args));
    if (options?.logResult) {
      [err, finalResult] = await tc(from(meta.result).toPromise());
      if (err) printArray.push(JSON.stringify(err.message));
      else printArray.push(JSON.stringify(finalResult));
    }
    if (err) logger.error(printArray.join(' -> '));
    else logger.debug(printArray.join(' -> '));
  });

  return applyDecorators(before, after);
};

export const LogMe1 = () => {
  const before = beforeMethod((meta) => {
    logger.debug(`ENTER LOGME -> before,args -> ${meta.args}`);
  });
  const after = afterMethod(async (meta) => {
    let finalResult;
    [, finalResult] = await tc(from(meta.result).toPromise());
    logger.debug(`EXIT LOGME -> result -> ${finalResult}`);
  });
  return applyDecorators(before, after);
};
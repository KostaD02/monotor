import { LoggerService, Injectable } from '@nestjs/common';
import { Logger, LoggerSide } from '@fitmonitor/util';

@Injectable()
export class CustomLogger implements LoggerService {
  // TODO: save? or just log?
  log(message: string) {
    Logger.log(message, LoggerSide.Server);
  }

  fatal(message: string) {
    Logger.error(message, LoggerSide.Server);
  }

  error(message: string) {
    Logger.error(message, LoggerSide.Server);
  }

  warn(message: string) {
    Logger.warn(message, LoggerSide.Server);
  }

  debug?(message: string) {
    Logger.info(message, LoggerSide.Server);
  }

  verbose?(message: string) {
    Logger.info(message, LoggerSide.Server);
  }
}

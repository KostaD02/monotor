export enum LoggerSide {
  General = 'GENERAL',
  Server = 'SERVER',
  Client = 'CLIENT',
}

export function timePrefix() {
  return `[${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}]`;
}

// TODO: Save somewhere logs?

export class Logger {
  static log(message: string, side = LoggerSide.General) {
    console.log(`[${side}] [LOG] ${timePrefix()} ${message}`);
  }

  static info(message: string, side = LoggerSide.General) {
    console.info(`[${side}] [INFO] ${timePrefix()} ${message}`);
  }

  static error(message: string, side = LoggerSide.General) {
    console.error(`[${side}] [ERROR] ${timePrefix()} ${message}`);
  }

  static warn(message: string, side = LoggerSide.General) {
    console.warn(`[${side}] [WARN] ${timePrefix()} ${message}`);
  }
}

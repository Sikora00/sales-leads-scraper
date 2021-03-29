export const LoggerConfigToken = Symbol('LoggerConfigInterface');
export interface LoggerConfigInterface {
  isInCloud: boolean;
  logLevel?: string;
}

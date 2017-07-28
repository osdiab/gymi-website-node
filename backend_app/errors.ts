/**
 * Common errors at the application level.
 */
import * as _ from 'lodash';

/**
 * Represents an error that should return a particular response code, and optionally a message and
 * some data.
 *
 * Only statusCode is required. It must be a code between 400 to 599 inclusive.
 */
export class ApplicationError extends Error {
  public statusCode: number;
  // tslint:disable-next-line:no-any
  public data: any;

  // tslint:disable-next-line:no-any
  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    if (_([message, statusCode]).compact().value().length !== 2) {
      throw new Error('message and statusCode must be provided');
    }

    if (statusCode < 400 || statusCode >= 600) {
      throw new Error('statusCode must be a number between 400 and 599 inclusive');
    }

    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}

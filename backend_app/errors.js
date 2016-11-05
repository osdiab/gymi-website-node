import _ from 'lodash';

/**
 * Represents an error that should return a particular response code, and optionally a message and
 * some data.
 *
 * Only statusCode is required. It must be a code between 400 to 599 inclusive.
 */
export class ApplicationError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    if (_.omitBy([message, statusCode], _.isEmpty) !== 2) {
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

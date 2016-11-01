/**
 * Represents an error that should return a particular response code, and optionally a message and
 * some data.
 *
 * Only statusCode is required. It must be a code between 400 to 599 inclusive.
 */
export class ApplicationError extends Error {
  constructor(message, statusCode, data) {
    super(message);

    if (!isNaN(message)) {
      if (statusCode) {
        throw new Error('Message cannot just be a number');
      }
      this.noMessage = true;
      this.statusCode = parseInt(message, 10);
    } else {
      this.statusCode = statusCode;
    }
    if (!this.statusCode || this.statusCode < 400 || this.statusCode >= 600) {
      throw new Error('statusCode must be a number between 400 and 599 inclusive');
    }
    this.data = data;
  }
}

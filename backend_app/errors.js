export class ApplicationError extends Error {
  constructor(message, statusCode, data) {
    super(message);
    if (!statusCode) {
      throw new Error('statusCode required in constructor');
    }
    this.statusCode = statusCode;
    this.data = data;
    console.log(this.message, this.statusCode);
  }
}

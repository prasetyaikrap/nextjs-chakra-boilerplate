export class HTTPError extends Error {
  public readonly statusCode: number;
  public readonly data?: any;

  constructor(message: string, statusCode: number, data?: any) {
    super(message);
    this.name = "HTTPError";
    this.statusCode = statusCode;
    this.data = data;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HTTPError);
    }
  }
}

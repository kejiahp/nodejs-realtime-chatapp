export class AppError extends Error {
  statusCode: number;
  errorCode?: any;

  constructor(message: string, statusCode: number, errorCode?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode || "error";
  }
}

class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }

  static BadRequest(code: string, message: string) {
    return new ApiError(400, code, message);
  }
}

export default ApiError;

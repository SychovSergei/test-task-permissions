import ApiError from "./api-error";

export class RolesError extends ApiError {
  constructor(status: number, code: string, message: string) {
    super(status, `roles/${code}`, message);
  }

  static BadRequest = (code: string, message: string) =>
    new RolesError(400, code, message);

  static NotFound(data?: string) {
    const message = data ? `Not found` : `Task with data "${data}" not found`;
    return new RolesError(404, "not-found", message);
  }
}

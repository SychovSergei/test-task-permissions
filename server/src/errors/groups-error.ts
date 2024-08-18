import ApiError from "./api-error";

export class GroupsError extends ApiError {
  constructor(status: number, code: string, message: string) {
    super(status, `groups/${code}`, message);
  }

  static BadRequest = (code: string, message: string) =>
    new GroupsError(400, code, message);

  static NotFound(data?: string) {
    const message = data ? `Not found` : `Task with data "${data}" not found`;
    return new GroupsError(404, "not-found", message);
  }
}

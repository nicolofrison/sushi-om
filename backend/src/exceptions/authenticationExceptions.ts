import HttpException from "./HttpException";

export enum AuthenticationTokenExceptionType {
  Wrong,
  Missing,
}

export class AuthenticationTokenException extends HttpException {
  constructor(type: AuthenticationTokenExceptionType) {
    if (type === AuthenticationTokenExceptionType.Wrong) {
      super(401, "Wrong authentication token");
    } else {
      super(401, "Authentication token missing");
    }
  }
}

import ExtendedHttpException from "./ExtendedHttpException";

export enum AuthenticationExceptionType {
  General,
  WrongAuthenticationToken,
  MissingOrWrongAuthenticationToken,
  ExpiredAuthenticationToken
}

export class AuthenticationException extends ExtendedHttpException {
  constructor(type: AuthenticationExceptionType) {
    switch (type) {
      case AuthenticationExceptionType.ExpiredAuthenticationToken:
        super(401, "The authentication token is expired","expiredAuthenticationToken");
        break;
      case AuthenticationExceptionType.General:
        super(401, "Authentication error", "authenticationError");
        break;
      case AuthenticationExceptionType.MissingOrWrongAuthenticationToken:
        super(401, "The authentication token is missing or wrong", "missingOrWrongAuthenticationToken");
        break;
      case AuthenticationExceptionType.WrongAuthenticationToken:
        super(401, "The authentication token is wrong", "wrongAuthenticationToken");
        break;
    }
  }
}

import ExtendedError from "./ExtendedError";

export default class UserDoesNotExistsException extends ExtendedError {
    constructor() {
      super("The user does not exists", "userDoesNotExists");
    }
  }  
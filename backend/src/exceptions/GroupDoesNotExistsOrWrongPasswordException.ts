import ExtendedError from "./ExtendedError";

export default class GroupDoesNotExistsOrWrongPasswordException extends ExtendedError {
  constructor() {
    super("The group does not exists or the password inserted is wrong", "groupDoesNotExistsOrWrongPassword");
  }
}

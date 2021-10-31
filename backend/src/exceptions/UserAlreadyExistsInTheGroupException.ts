import ExtendedError from "./ExtendedError";

export default class UserAlreadyExistsInTheGroupException extends ExtendedError {
  constructor() {
    super("The user already exists in the group", "userAlreadyExistsInGroup");
  }
}

import ExtendedError from "./ExtendedError";

export default class GroupAlreadyExistsException extends ExtendedError {
  constructor() {
    super("The group already exists", "groupAlreadyExists");
  }
}

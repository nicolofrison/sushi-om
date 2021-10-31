import ExtendedError from "./ExtendedError";

export default class GroupDoesNotExistsException extends ExtendedError {
    constructor() {
      super("The group does not exists", "groupDoesNotExists");
    }
  }
  
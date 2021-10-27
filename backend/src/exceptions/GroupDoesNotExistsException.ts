export default class GroupDoesNotExistsException extends Error {
    constructor() {
      super("The group does not exists");
    }
  }
  
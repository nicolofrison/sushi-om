export default class GroupDoesNotExistsOrWrongPasswordException extends Error {
  constructor() {
    super("The group does not exists or the password inserted is wrong");
  }
}
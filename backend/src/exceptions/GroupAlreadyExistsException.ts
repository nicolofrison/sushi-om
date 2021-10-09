export default class GroupAlreadyExistsException extends Error {
  constructor() {
    super("The group already exists");
  }
}

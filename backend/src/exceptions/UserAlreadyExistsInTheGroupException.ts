export default class UserAlreadyExistsInTheGroupException extends Error {
  constructor() {
    super("The user already exists in the group");
  }
}
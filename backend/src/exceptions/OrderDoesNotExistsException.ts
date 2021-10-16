export default class OrderDoesNotExistsException extends Error {
  constructor() {
    super("The order does not exists");
  }
}

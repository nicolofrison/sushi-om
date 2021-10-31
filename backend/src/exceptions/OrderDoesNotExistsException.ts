import ExtendedError from "./ExtendedError";

export default class OrderDoesNotExistsException extends ExtendedError {
  constructor() {
    super("The order does not exists", "orderDoesNotExists");
  }
}

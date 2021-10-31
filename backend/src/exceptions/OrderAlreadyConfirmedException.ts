import ExtendedError from "./ExtendedError";

export default class OrderAlreadyConfirmedException extends ExtendedError {
  constructor() {
    super("The order is already confirmed, so it can't be edited", "orderAlreadyConfirmedCannotEdit");
  }
}

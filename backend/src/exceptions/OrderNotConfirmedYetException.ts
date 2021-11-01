import ExtendedError from "./ExtendedError";

export default class OrderIsNotConfirmedException extends ExtendedError {
  constructor() {
    super("The order is not confirmed", "orderIsNotConfirmed");
  }
}

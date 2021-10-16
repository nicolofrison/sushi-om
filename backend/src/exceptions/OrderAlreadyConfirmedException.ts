export default class OrderAlreadyConfirmedException extends Error {
  constructor() {
    super("The order is already confirmed, so it can't be edited");
  }
}

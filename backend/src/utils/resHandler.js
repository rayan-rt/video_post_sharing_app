export class ResHandler {
  constructor(status, data, message = "Everything is good") {
    this.status = status;
    this.message = message;
    this.data = data;
    this.success = status < 400;
  }
}

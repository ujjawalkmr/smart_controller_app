export class ApiException extends Error {
  constructor({
    response = null,
    networkError = false,
    message = "Something went wrong",
    status = null,
  } = {}) {
    super(message);

    this.name = "ApiException";
    this.response = response;
    this.networkError = networkError;
    this.message = message;
    this.status = status;
  }
}
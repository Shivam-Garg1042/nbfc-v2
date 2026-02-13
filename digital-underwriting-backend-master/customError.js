export default class CustomError extends Error {
  constructor(message, status) {
    super(message); // Call the parent class constructor (Error)
    this.status = status; // Add the status property
    this.name = this.constructor.name; // Set the error name as the class name
  }
}

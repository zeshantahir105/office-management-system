const { isStringified } = require("./helpers.utils");

function AppError({ error = "Something went wrong!", status = 500 }) {
  if (process.env.NODE_ENV === "local") console.trace(error);
  Error.call(this);
  Error.captureStackTrace(this);
  this.status = status;

  if (status >= 422 || status === 403) {
    //only if error.name exist
    this.name = error.name;
    //if error.name & message exist then show both
    if (error.name && error.message) {
      this.message = `${error.name}: ${error.message}`;
    }
    //else if only error.message exist then show error.message
    else if (error.message) {
      this.message = error.message;
    }
    //else show simple string/object error
    else {
      this.message = isStringified(error);
    }
  }

  return undefined;
}

AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

module.exports = { AppError };

export class ErrorHandler extends Error {
  constructor(
    status,
    message = "Something went wrong!",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.success = false;
    this.data = null;
    this.status = status;
    this.message = message;
    this.errors = errors;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: this.success,
      redirect: "/signin",
      data: this.data,
      status: this.status,
      errors: this.errors.message
        ? { message: this.errors.message }
        : { message: this.message },
    };
  }
}

// You don’t need to manually call "toJSON()" it’s called automatically when you pass an object with "toJSON()" defined to "res.json()", due to "res.json()" "toJSON()" class method call automatically., BTW we use "res.json()" in controllers side code.

"use strict";

export const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
};

export const ReasonStatusCode = {
  FORBIDDEN: "Forbidden error",
  CONFLICT: "Conflict error",
  NOT_FOUND: "Not found error",
  INTERNAL_SERVER_ERROR: "Internal server error",
  UNAUTHORIZED: "Unauthorized error",
  BAD_REQUEST: "Bad request error",
};

class ErrorResponse extends Error {
  statusCode: number;
  reasonStatusCode: string;
  constructor(
    message: string,
    statusCode = StatusCode.INTERNAL_SERVER_ERROR,
    reasonStatusCode = ReasonStatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.statusCode = statusCode;
    this.reasonStatusCode = reasonStatusCode;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message: string,
    statusCode = StatusCode.CONFLICT,
    reasonStatusCode = ReasonStatusCode.CONFLICT
  ) {
    super(message, statusCode, reasonStatusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message: string,
    statusCode = StatusCode.FORBIDDEN,
    reasonStatusCode = ReasonStatusCode.FORBIDDEN
  ) {
    super(message, statusCode, reasonStatusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message: string,
    statusCode = StatusCode.NOT_FOUND,
    reasonStatusCode = ReasonStatusCode.NOT_FOUND
  ) {
    super(message, statusCode, reasonStatusCode);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(
    message: string,
    statusCode = StatusCode.UNAUTHORIZED,
    reasonStatusCode = ReasonStatusCode.UNAUTHORIZED
  ) {
    super(message, statusCode, reasonStatusCode);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(
    message: string,
    statusCode = StatusCode.INTERNAL_SERVER_ERROR,
    reasonStatusCode = ReasonStatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode, reasonStatusCode);
  }
}
class ForbiddenError extends ErrorResponse {
  constructor(
    message: string,
    statusCode = StatusCode.FORBIDDEN,
    reasonStatusCode = ReasonStatusCode.FORBIDDEN
  ) {
    super(message, statusCode, reasonStatusCode);
  }
}
export {
  BadRequestError,
  ConflictRequestError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
  ForbiddenError,
};

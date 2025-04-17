"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.InternalServerError = exports.UnauthorizedError = exports.NotFoundError = exports.ConflictRequestError = exports.BadRequestError = exports.ReasonStatusCode = exports.StatusCode = void 0;
exports.StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
};
exports.ReasonStatusCode = {
    FORBIDDEN: "Forbidden error",
    CONFLICT: "Conflict error",
    NOT_FOUND: "Not found error",
    INTERNAL_SERVER_ERROR: "Internal server error",
    UNAUTHORIZED: "Unauthorized error",
    BAD_REQUEST: "Bad request error",
};
class ErrorResponse extends Error {
    constructor(message, errors = null, statusCode = exports.StatusCode.INTERNAL_SERVER_ERROR, reasonStatusCode = exports.ReasonStatusCode.INTERNAL_SERVER_ERROR) {
        super(message);
        this.statusCode = statusCode;
        this.reasonStatusCode = reasonStatusCode;
        this.errors = errors;
    }
}
class ConflictRequestError extends ErrorResponse {
    constructor(message, errors = null, statusCode = exports.StatusCode.CONFLICT, reasonStatusCode = exports.ReasonStatusCode.CONFLICT) {
        super(message, errors, statusCode, reasonStatusCode);
    }
}
exports.ConflictRequestError = ConflictRequestError;
class BadRequestError extends ErrorResponse {
    constructor(message, errors = null, statusCode = exports.StatusCode.BAD_REQUEST, reasonStatusCode = exports.ReasonStatusCode.BAD_REQUEST) {
        super(message, errors, statusCode, reasonStatusCode);
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends ErrorResponse {
    constructor(message, errors = null, statusCode = exports.StatusCode.NOT_FOUND, reasonStatusCode = exports.ReasonStatusCode.NOT_FOUND) {
        super(message, errors, statusCode, reasonStatusCode);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends ErrorResponse {
    constructor(message, errors = null, statusCode = exports.StatusCode.UNAUTHORIZED, reasonStatusCode = exports.ReasonStatusCode.UNAUTHORIZED) {
        super(message, errors, statusCode, reasonStatusCode);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class InternalServerError extends ErrorResponse {
    constructor(message, errors = null, statusCode = exports.StatusCode.INTERNAL_SERVER_ERROR, reasonStatusCode = exports.ReasonStatusCode.INTERNAL_SERVER_ERROR) {
        super(message, errors, statusCode, reasonStatusCode);
    }
}
exports.InternalServerError = InternalServerError;
class ForbiddenError extends ErrorResponse {
    constructor(message, errors = null, statusCode = exports.StatusCode.FORBIDDEN, reasonStatusCode = exports.ReasonStatusCode.FORBIDDEN) {
        super(message, errors, statusCode, reasonStatusCode);
    }
}
exports.ForbiddenError = ForbiddenError;

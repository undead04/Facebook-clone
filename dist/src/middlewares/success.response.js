'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATED = exports.OK = void 0;
const StatusCode = {
    OK: 200,
    CREATED: 201
};
const ReasonStatusCode = {
    CREATED: "Created",
    OK: "Success"
};
class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metaData = {} }) {
        this.message = message;
        this.statusCode = statusCode;
        this.reasonStatusCode = reasonStatusCode;
        this.metaData = metaData;
    }
    send(res) {
        return res.status(this.statusCode).json(this);
    }
}
class OK extends SuccessResponse {
    constructor({ message, metaData }) {
        super({ message, metaData });
    }
}
exports.OK = OK;
class CREATED extends SuccessResponse {
    constructor({ message, metaData }) {
        super({ message, metaData, statusCode: StatusCode.CREATED, reasonStatusCode: ReasonStatusCode.CREATED });
    }
}
exports.CREATED = CREATED;

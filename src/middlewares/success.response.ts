'use strict'

import { Request, Response } from "express"

const StatusCode = {
    OK: 200,
    CREATED: 201
}

const ReasonStatusCode = {
    CREATED: "Created",
    OK: "Success"
}

class SuccessResponse {
    private statusCode: number;
    private message: string;
    private reasonStatusCode: string;
    private metaData: any;

    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metaData = {} }: 
                { message: string; statusCode?: number; reasonStatusCode?: string; metaData?: any }) {
        this.message = message;
        this.statusCode = statusCode;
        this.reasonStatusCode = reasonStatusCode;
        this.metaData = metaData;
    }

    send(res: Response) {
        return res.status(this.statusCode).json(this);
    }
}

class OK extends SuccessResponse {
    constructor({ message, metaData }: { message: string; metaData?: any }) {
        super({ message, metaData });
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, metaData }: { message: string; metaData?: any }) {
        super({ message, metaData, statusCode: StatusCode.CREATED, reasonStatusCode: ReasonStatusCode.CREATED });
    }
}

export { OK, CREATED };

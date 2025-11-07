import { pino } from "../config/pino.js"
import { handlePrismaKnownErrors } from "../helpers/errors.js"
import BaseError, { ValidationError } from "../lib/errors.js"
import z, { ZodError } from "zod"
import createHttpError from "http-errors"

export const errorHandler = (error, req, res, next) => {
    pino.error(error)

    let errorResponse

    if (error instanceof ZodError) {
        errorResponse = new ValidationError(
            "Invalid request",
            400,
            z.flattenError(error)
        )
    }

    if (createHttpError.isHttpError(error)) {
        errorResponse = new BaseError(error.message, error.statusCode, {
            name: "HttpError",
        })
    }

    errorResponse = handlePrismaKnownErrors(error) ?? errorResponse

    const shouldSendCause = process.env.NODE_ENV === "development"

    errorResponse =
        errorResponse ??
        new BaseError(
            "Something went wrong",
            500,
            ...(shouldSendCause && { cause: error })
        )

    return res
        .status(errorResponse.statusCode)
        .json({ error: errorResponse.toResponse() })
}

import { pino } from "../config/pino.js"
import { handlePrismaKnownErrors } from "../helpers/errors.js"
import BaseError, { ValidationError } from "../lib/errors.js"
import z, { ZodError } from "zod"
import createHttpError from "http-errors"
import { Prisma } from "@prisma/client"

export const errorHandler = (error, req, res, next) => {
    pino.error(error)

    let handledError

    if (error instanceof ZodError) {
        handledError = new ValidationError(
            "Invalid request",
            400,
            z.flattenError(error)
        )
    }

    if (createHttpError.isHttpError(error)) {
        handledError = new BaseError(error.message, error.statusCode, {
            name: "HttpError",
        })
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        handledError = handlePrismaKnownErrors(error)
    }

    const shouldSendCause = process.env.NODE_ENV === "development" || false
    const errorResponse =
        error instanceof BaseError
            ? error
            : (handledError ??
              new BaseError(
                  "Something went wrong",
                  500,
                  shouldSendCause && { cause: error }
              ))

    return res
        .status(errorResponse.statusCode)
        .json({ error: errorResponse.toResponse() })
}

import { Prisma } from "@prisma/client"
import { NotFoundError, UniqueConstraintError } from "../lib/errors.js"

export const handlePrismaKnownErrors = (
    error,
    { uniqueConstraintName = null } = {}
) => {
    if (!error) {
        return
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError == false) {
        // Rethrow error if is not a prisma known errors
        return
    }

    if (error.code === "P2002") {
        const targets = error.meta?.target
        if (targets.includes(uniqueConstraintName)) {
            return new UniqueConstraintError(
                `${uniqueConstraintName} given value already exists.`
            )
        }
        return new UniqueConstraintError(
            `${targets.at(-1) ?? "Some fields"} given value already exists.`
        )
    }

    if (error.code === "P2016") {
        const { details } = error
        if (details.includes("RecordNotFound")) {
            return new NotFoundError("Not found", 404)
        }
    }

    if (error.code === "P2025") {
        return new NotFoundError("Not found", 404)
    }
}

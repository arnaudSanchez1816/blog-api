import { ZodError, ZodObject } from "zod"
import _ from "lodash"
import { ValidationError } from "../lib/errors.js"
import type { Request, Response, NextFunction } from "express"

interface ZodRequestObject extends ZodObject<any> {
    shape: {
        body?: ZodObject<any>
        params?: ZodObject<any>
        query?: ZodObject<any>
    }
}

export const validateRequest =
    (validator: ZodRequestObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await validator.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query,
            })

            _.merge(req.params, data.params)
            _.merge(req.body, data.body)
            updateQuery(req, _.merge(req.query, data.query))

            return next()
        } catch (error) {
            if (error instanceof ZodError) {
                const details = error.issues
                    .map((i) => ({ field: i.path.pop(), message: i.message }))
                    .reduce(
                        (detailsMap, issue) => {
                            const { field, message } = issue
                            if (!field) {
                                return detailsMap
                            }
                            detailsMap[field] = message
                            return detailsMap
                        },
                        {} as Record<PropertyKey, string>
                    )

                throw new ValidationError("Invalid request", 400, details)
            }
            // Rethrow
            throw error
        }
    }

// This only modifies req.query when it must change due to validation.
// `req.query` remains immutable after changing it here.
function updateQuery(req: Request, value: Record<string, any>) {
    Object.defineProperty(req, "query", {
        ...Object.getOwnPropertyDescriptor(req, "query"),
        writable: false,
        value,
    })
}

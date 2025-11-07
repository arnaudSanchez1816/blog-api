import { ZodError, ZodAny } from "zod"
import _ from "lodash"
import { ValidationError } from "../lib/errors.js"

/**
 *
 * @param {ZodAny} validator
 * @returns
 */
export const validateRequest = (validator) => async (req, res, next) => {
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
            const ignoredPaths = ["body", "query", "params"]
            const fields = error.issues.reduce((detailsMap, issue) => {
                const fieldName = issue.path
                    .filter((p) => !ignoredPaths.includes(p))
                    .join(".")
                const detailsValue = detailsMap[fieldName]
                if (!detailsValue) {
                    // Set as string
                    detailsMap[fieldName] = issue.message
                } else {
                    // Replace the string with an array
                    detailsMap[fieldName] =
                        typeof detailsValue === "string"
                            ? [detailsValue, issue.message]
                            : [...detailsValue, issue.message]
                }

                return detailsMap
            }, {})

            throw new ValidationError("Invalid request", 400, fields)
        }
        // Rethrow
        throw error
    }
}

// This only modifies req.query when it must change due to validation.
// `req.query` remains immutable after changing it here.
function updateQuery(req, value) {
    Object.defineProperty(req, "query", {
        ...Object.getOwnPropertyDescriptor(req, "query"),
        writable: false,
        value,
    })
}

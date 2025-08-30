import { signupValidator } from "./signupSchemas.js"
import { errors } from "@vinejs/vine"
import signupService from "./signupService.js"

export const signup = async (req, res, next) => {
    try {
        const { name, email, password } = await signupValidator.validate(
            req.body
        )

        const newUser = await signupService.signupUser({
            name,
            email,
            password,
        })

        return res.status(201).json({ newUser })
    } catch (error) {
        if (error instanceof errors.E_VALIDATION_ERROR) {
            return res.status(400).json({
                errors: error.messages.map((err) => {
                    return {
                        field: err.field,
                        message: err.message,
                    }
                }),
            })
        }
    }
}

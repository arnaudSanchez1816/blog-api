import { signupValidator } from "./signupSchemas.js"
import { errors } from "@vinejs/vine"

export const signup = async (req, res) => {
    try {
        const { name, email, password } = await signupValidator.validate(
            req.body
        )

        return res.status(201).json({
            name,
            email,
            password,
        })
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

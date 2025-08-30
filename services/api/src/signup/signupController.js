import { signupValidator } from "./signupSchemas.js"
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
        next(error)
    }
}

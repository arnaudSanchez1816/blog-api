import { loginValidator } from "./authValidators.js"
import passport from "passport"
import { strategies } from "../config/passport.js"
import authService from "./authService.js"
import { validateRequest } from "../middlewares/validator.js"
import { AuthenticationError } from "../helpers/errors.js"
import createHttpError from "http-errors"

export const login = [
    validateRequest(loginValidator),
    passport.authenticate(strategies.local, {
        session: false,
        failWithError: true,
    }),
    async (req, res, next) => {
        try {
            const user = req.user
            const accessToken = await authService.generateAccessToken(user, {
                expiresIn: "1 day",
            })
            return res.json({
                accessToken: accessToken,
            })
        } catch (error) {
            next(error)
        }
    },

    (error, req, res, next) => {
        if (error instanceof AuthenticationError) {
            return next(createHttpError.Unauthorized(error.message))
        }
        next(error)
    },
]

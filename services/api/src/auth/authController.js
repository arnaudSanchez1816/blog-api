import { loginValidator } from "./authSchemas.js"
import passport from "passport"
import { strategies } from "../config/passport.js"
import authService from "./authService.js"

export const login = [
    async (req, res, next) => {
        try {
            await loginValidator.validate(req.body)
            return next()
        } catch (error) {
            next(error)
        }
    },
    passport.authenticate(strategies.local, { session: false }),
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
]

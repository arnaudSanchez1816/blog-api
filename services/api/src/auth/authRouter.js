import { Router } from "express"
import { getAccessToken, login } from "./authController.js"
import passport from "passport"
import { strategies } from "../config/passport.js"

const router = Router()

router.get(
    "/token",
    passport.authenticate(strategies.jwtRefresh, { session: false }),
    getAccessToken
)
router.post("/login", login)

export default router

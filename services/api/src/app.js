import "dotenv/config"
import cookieParser from "cookie-parser"
import express from "express"
import helmet from "helmet"
import pinoHttp from "pino-http"
import createHttpError from "http-errors"
import signupRouter from "./signup/signupRouter.js"
import authRouter from "./auth/authRouter.js"
import passport from "./config/passport.js"
import { pino } from "./config/pino.js"

const app = express()

app.use(pinoHttp())
app.disable("x-powered-by")
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// Passport
app.use(passport.initialize())

const v1Router = express.Router()
v1Router.use("/signup", signupRouter)
v1Router.use("/auth", authRouter)
app.use("/v1/api", v1Router)

// 404 error
// eslint-disable-next-line
app.use((req, res, next) => {
    throw new createHttpError.NotFound()
})

// Error handler
// eslint-disable-next-line
app.use((error, req, res, next) => {
    let errors = {
        message: error.message,
    }
    if (error instanceof errors.E_VALIDATION_ERROR) {
        error = error.messages.map((e) => {
            return {
                field: e.field,
                message: e.message,
            }
        })
        error.status = 400
    } else {
        errors.push({
            message: error.message,
        })
    }

    pino.error(error)
    return res.status(error.status || 500).json({ errors })
})

export default app

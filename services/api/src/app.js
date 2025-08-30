import "dotenv/config"
import cookieParser from "cookie-parser"
import express from "express"
import helmet from "helmet"
import pinoHttp from "pino-http"
import createHttpError from "http-errors"
import signupRouter from "./signup/signupRouter.js"
import passport from "./config/passport.js"

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
app.use("/v1", v1Router)

// 404 error
// eslint-disable-next-line
app.use((req, res, next) => {
    throw new createHttpError.NotFound()
})

// Error handler
// eslint-disable-next-line
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    return res.json({ error: err.message })
})

export default app

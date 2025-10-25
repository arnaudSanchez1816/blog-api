import "dotenv/config"
import cookieParser from "cookie-parser"
import express from "express"
import helmet from "helmet"
import pinoHttp from "pino-http"
import createHttpError from "http-errors"
import signupRouter from "./signup/signupRouter.js"
import authRouter from "./auth/authRouter.js"
import postsRouter from "./posts/postsRouter.js"
import usersRouter from "./users/usersRouter.js"
import commentsRouter from "./comments/commentsRouter.js"
import tagsRouter from "./tags/tagsRouter.js"
import passport from "./config/passport.js"
import { pino } from "./config/pino.js"
import { ZodError, z } from "zod"
import cors from "cors"
import { AlreadyExistsError } from "./helpers/errors.js"
import { Prisma } from "@prisma/client"

const app = express()

app.use(pinoHttp())
app.disable("x-powered-by")
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(process.env.SIGNED_COOKIE_SECRET))
app.use(
    cors({ origin: process.env.CORS_ORIGIN_URL.split(","), credentials: true })
)
// Passport
app.use(passport.initialize())

const v1Router = express.Router()
// Not useful right now
// Regular user can't create posts and unsigned users can already create comments
//v1Router.use("/signup", signupRouter)
v1Router.use("/auth", authRouter)
v1Router.use("/posts", postsRouter)
v1Router.use("/users", usersRouter)
v1Router.use("/comments", commentsRouter)
v1Router.use("/tags", tagsRouter)
app.use("/api/v1", v1Router)

// 404 error
// eslint-disable-next-line
app.use((req, res, next) => {
    throw new createHttpError.NotFound()
})

// Error handler
// eslint-disable-next-line
app.use((error, req, res, next) => {
    pino.error(error)
    let errorMessage = error.message
    let details = undefined

    if (error instanceof AlreadyExistsError) {
        error.status = 400
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case "P2016": {
                const { details } = error
                if (details.includes("RecordNotFound")) {
                    error.status = 404
                    errorMessage = "Not found"
                }
                break
            }
            case "P2025":
                error.status = 404
                errorMessage = "Not found"
                break
            default:
                error.status = 500
                errorMessage = error.message
                break
        }
    }

    if (error instanceof ZodError) {
        errorMessage = "Invalid input data"
        const ignoredPaths = ["body", "query", "params"]
        details = error.issues.reduce((detailsMap, issue) => {
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
        error.status = 400
    }

    return res
        .status(error.status || 500)
        .json({ error: { errorMessage, details } })
})

export default app

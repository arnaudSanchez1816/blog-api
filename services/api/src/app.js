import "dotenv/config"
import cookieParser from "cookie-parser"
import express from "express"
import helmet from "helmet"
import pinoHttp from "pino-http"

const app = express()

app.use(pinoHttp())
app.disable("x-powered-by")
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.get("/", (req, res) => {
    return res.send("Hello world !")
})

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send(err.message)
})

export default app

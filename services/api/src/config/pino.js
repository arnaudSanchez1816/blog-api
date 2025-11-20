import pinoMake from "pino"
import { prettyFactory } from "pino-pretty"

let hooks = undefined

if (process.env.NODE_ENV === "test") {
    const prettify = prettyFactory({ sync: true, colorize: true })
    hooks = {
        streamWrite: (s) => {
            console.log(prettify(s)) // Mirror to console.log during tests
            return s
        },
    }
}

const options = {
    level: process.env.PINO_LOG_LEVEL || "info",
}
if (hooks) {
    options.hooks = hooks
}
export const pino = pinoMake(options)

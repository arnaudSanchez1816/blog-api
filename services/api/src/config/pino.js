import pinoMake from "pino"

export const pino = pinoMake({ level: process.env.PINO_LOG_LEVEL || "info" })

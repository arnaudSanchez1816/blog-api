import { describe, expect, it, beforeEach } from "vitest"
import { api, v1Api } from "./helpers/supertest.js"
import prisma from "./helpers/prisma.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { REFRESH_TOKEN_COOKIE } from "../config/passport.js"
import { extractCookies, parseSigned } from "./helpers/extract-cookies.js"

describe("/auth", () => {
    describe("[POST] /auth/login", () => {
        const userEmail = "user@email.com"
        const userPassword = "password"
        beforeEach(async () => {
            const hashedPassword = bcryptjs.hashSync(
                userPassword,
                +process.env.PASSWORD_SALT_LENGTH
            )
            await prisma.user.create({
                data: {
                    email: userEmail,
                    name: "user",
                    password: hashedPassword,
                },
            })
        })
        it("should respond 200 and send the user details", async () => {
            const { status, body } = await api.post(v1Api("/auth/login")).send({
                email: userEmail,
                password: userPassword,
            })

            expect(status).toBe(200)
            expect(body).toHaveProperty("user")
            const { user } = body
            expect(user.name).toBe("user")
            expect(user.email).toBe(userEmail)
            expect(user).not.toHaveProperty("password")
        })

        it("should respond 200 and send a valid access token", async () => {
            const { status, body } = await api.post(v1Api("/auth/login")).send({
                email: userEmail,
                password: userPassword,
            })

            expect(status).toBe(200)
            expect(body).toHaveProperty("accessToken")
            const { accessToken } = body
            expect(
                jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
            ).not.toBeNull()
        })

        it("should respond 200 and set a valid jwt refresh token as a http only cookie", async () => {
            const { status, headers } = await api
                .post(v1Api("/auth/login"))
                .send({
                    email: userEmail,
                    password: userPassword,
                })

            expect(status).toBe(200)
            const cookies = extractCookies(headers)
            const refreshTokenCookie = cookies[REFRESH_TOKEN_COOKIE]
            expect(refreshTokenCookie).not.toBeNull()

            // Parse signed token
            const { value: signedValue } = refreshTokenCookie
            const refreshToken = parseSigned(signedValue)
            expect(refreshToken).not.toBe(false) // parseSigned return false if the signed cookie is not valid
            expect(
                jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
            ).not.toBeNull()

            const { HttpOnly, Secure } = refreshTokenCookie.flags
            expect(HttpOnly).toBe(true)
            expect(Secure).toBe(true)
        })

        it("should respond 400 if the email field is not valid", async () => {
            const { status, body } = await api.post(v1Api("/auth/login")).send({
                email: "userNotEmail",
                password: userPassword,
            })

            expect(status).toBe(400)
            expect(body).toHaveProperty("error")
            const { errorMessage, details } = body.error
            expect(errorMessage).not.toBeNull()
            expect(details).toHaveProperty("email")
        })

        it("should respond 400 if the request is not valid", async () => {
            const { status, body } = await api.post(v1Api("/auth/login")).send({
                name: "wrongFieldName",
                pass: userPassword,
            })

            expect(status).toBe(400)
            expect(body).toHaveProperty("error")
            const { errorMessage, details } = body.error
            expect(errorMessage).not.toBeNull()
            expect(details).toHaveProperty("email")
            expect(details).toHaveProperty("password")
        })
    })
})

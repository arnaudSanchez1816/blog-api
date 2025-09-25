import jwt from "jsonwebtoken"

export const generateAccessToken = async (
    user,
    { expiresIn = "1 day" } = {}
) => {
    const accessToken = await new Promise((resolve, reject) => {
        jwt.sign(
            {
                sub: user.id,
                name: user.name,
                email: user.email,
            },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn,
                algorithm: "HS256",
            },
            (error, encodedToken) => {
                if (error) {
                    return reject(error)
                }

                resolve(encodedToken)
            }
        )
    })

    return accessToken
}

export const generateRefreshToken = async (
    user,
    { expiresIn = "30 days" } = {}
) => {
    const refreshToken = await new Promise((resolve, reject) => {
        jwt.sign(
            {
                sub: user.id,
                name: user.name,
                email: user.email,
            },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: expiresIn,
                algorithm: "HS256",
            },
            (err, encodedToken) => {
                if (err) {
                    return reject(err)
                }

                resolve(encodedToken)
            }
        )
    })

    return refreshToken
}

export * as default from "./authService.js"

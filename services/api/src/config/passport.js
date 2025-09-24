import passport from "passport"
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as AnonymousStrategy } from "passport-anonymous"
import bcrypt from "bcryptjs"
import userService from "../users/usersService.js"
import { AuthenticationError } from "../helpers/errors.js"

const jwtStrategy = new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
        algorithms: ["HS256"],
    },
    async (jwtPayload, done) => {
        try {
            const user = await userService.getUserById(jwtPayload.sub)

            if (!user) {
                return done(null, false)
            }

            return done(null, user)
        } catch (error) {
            done(error, false)
        }
    }
)
passport.use(jwtStrategy)

const LOCAL_AUTH_ERROR_MESSAGE = "Invalid e-mail/password"
const localStrategy = new LocalStrategy(
    {
        usernameField: "email",
        passwordField: "password",
        session: false,
    },
    async (username, password, done) => {
        try {
            const user = await userService.getUserByEmail(username)
            if (!user) {
                return done(
                    new AuthenticationError(LOCAL_AUTH_ERROR_MESSAGE),
                    false
                )
            }

            const passwordAreMatching = await bcrypt.compare(
                password,
                user.password
            )
            if (!passwordAreMatching) {
                return done(
                    new AuthenticationError(LOCAL_AUTH_ERROR_MESSAGE),
                    false
                )
            }

            return done(null, user)
        } catch (error) {
            done(error, false)
        }
    }
)
passport.use(localStrategy)

const anonymousStrategy = new AnonymousStrategy()
passport.use(anonymousStrategy)

export const strategies = {
    local: localStrategy.name,
    jwt: jwtStrategy.name,
    anonymous: anonymousStrategy.name,
}

export default passport

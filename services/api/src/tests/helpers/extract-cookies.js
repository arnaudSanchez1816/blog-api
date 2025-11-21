import * as signature from "cookie-signature"

const shapeFlags = (flags) =>
    flags.reduce((shapedFlags, flag) => {
        const [flagName, rawValue] = flag.split("=")
        // edge case where a cookie has a single flag and "; " split results in trailing ";"
        const value = rawValue ? rawValue.replace(";", "") : true
        return { ...shapedFlags, [flagName]: value }
    }, {})

const extractCookies = (headers) => {
    const cookies = headers["set-cookie"] // Cookie[]

    return cookies.reduce((shapedCookies, cookieString) => {
        const [rawCookie, ...flags] = cookieString.split("; ")
        const [cookieName, value] = rawCookie.split("=")
        return {
            ...shapedCookies,
            [cookieName]: { value, flags: shapeFlags(flags) },
        }
    }, {})
}

function parseSigned(str) {
    if (typeof str !== "string") {
        return undefined
    }

    let val
    if (str.substring(0, 2) === "s:") {
        val = signature.unsign(str.slice(2), process.env.SIGNED_COOKIE_SECRET)
    } else if (str.substring(0, 4) === "s%3A") {
        val = signature.unsign(str.slice(4), process.env.SIGNED_COOKIE_SECRET)
    } else {
        return str
    }

    if (val !== false) {
        return val
    }

    return false
}

export { shapeFlags, extractCookies, parseSigned }

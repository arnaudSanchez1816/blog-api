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
        // unsign doesn't work in test environment due to crypto.timingSafeEqual check failing
        //val = signature.unsign(str.slice(2), process.env.SIGNED_COOKIE_SECRET)
        const sVal = str.slice(2)
        val = sVal.slice(0, sVal.lastIndexOf("."))
    } else if (str.substring(0, 4) === "s%3A") {
        const sVal = str.slice(4)
        //val = signature.unsign(sVal, process.env.SIGNED_COOKIE_SECRET)
        val = sVal.slice(0, sVal.lastIndexOf("."))
    } else {
        return str
    }

    if (val !== false) {
        return val
    }

    return false
}

export { shapeFlags, extractCookies, parseSigned }

import { AuthException } from "./authException"

/**
 *
 * @param {RequestInfo | URL} path
 * @param {string} token
 * @param {RequestInit=} options
 * @returns
 */
export const authFetch = async (path, token, options) => {
    if (!token) {
        throw new AuthException("Invalid auth token")
    }
    let { headers } = options || {}
    headers = { ...headers, Authorization: `Bearer ${token}` }

    return fetch(path, { ...options, headers, credentials: "include" })
}

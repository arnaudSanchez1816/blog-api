import { createContext, useCallback, useMemo, useState } from "react"
import { useNavigate } from "react-router"

export const AuthContext = createContext({
    user: null,
    // eslint-disable-next-line
    login: ({ email, password }) => {},
    logoff: () => {},
})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    const login = useCallback(async ({ email, password }) => {
        try {
            const url = new URL("./auth/login", import.meta.env.VITE_API_URL)
            const response = await fetch(url, {
                body: JSON.stringify({
                    email,
                    password,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "cors",
                method: "post",
            })

            if (!response.ok) {
                throw response
            }

            const responseJson = await response.json()
            const { accessToken } = responseJson

            const newUser = {
                accessToken,
            }
            setUser(newUser)
            return newUser
        } catch (error) {
            const body = await error.json()
            const { errors } = body
            let message = "Failed to login"
            if (errors) {
                message = errors
            }
            return { error: message }
        }
    }, [])

    const logout = useCallback(() => {
        setUser(null)
        navigate("/login")
    }, [navigate])

    const providerValue = useMemo(() => {
        return { user, login, logout }
    }, [user, login, logout])

    return (
        <AuthContext.Provider value={providerValue}>
            {children}
        </AuthContext.Provider>
    )
}

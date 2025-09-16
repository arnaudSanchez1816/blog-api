import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react"

/**
 *
 * @callback SetTheme
 * @param {"dark" | "light"} newTheme - New theme name.
 */

export const ThemeContext = createContext({
    themeHtmlElement: document.documentElement,
})

/**
 *
 * @returns {[theme: String, setTheme: SetTheme]}
 */
export default function useTheme() {
    const { themeHtmlElement } = useContext(ThemeContext)

    const [theme, setThemeState] = useState(() => {
        const savedTheme = localStorage.getItem("theme") || undefined

        if (savedTheme) {
            return savedTheme
        }

        const systemTheme = window.matchMedia?.("(prefers-color-scheme: dark)")
            .matches
            ? "dark"
            : "light"
        return systemTheme
    })

    const setTheme = useCallback(
        (newTheme) => {
            console.log(newTheme)

            if (!newTheme) {
                console.error("Invalid theme")
                return
            }

            localStorage.setItem("theme", newTheme)
            themeHtmlElement.classList.remove("light", "dark", theme)
            themeHtmlElement.classList.add(newTheme)
            setThemeState(newTheme)
        },
        [theme, themeHtmlElement.classList]
    )

    useEffect(() => {
        setTheme(theme)
    }, [setTheme, theme])

    return [theme, setTheme]
}

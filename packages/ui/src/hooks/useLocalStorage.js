import { useCallback, useState } from "react"

export default function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        const storedValue = window.localStorage.getItem(key)

        if (storedValue) {
            return JSON.parse(storedValue)
        }

        window.localStorage.setItem(key, JSON.stringify(initialValue))
        return initialValue
    })

    const setValue = useCallback(
        (newValue) => {
            window.localStorage.setItem(key, JSON.stringify(newValue))
            setStoredValue(newValue)
        },
        [key]
    )

    return [storedValue, setValue]
}

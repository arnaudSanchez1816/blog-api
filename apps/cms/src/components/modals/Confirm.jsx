import { useEffect } from "react"

export default function Confirm({ message, onConfirm, onCancel }) {
    useEffect(() => {
        let ignore = false
        const confirmed = confirm(message)
        if (ignore) {
            return
        }

        if (confirmed) {
            onConfirm()
        } else {
            onCancel()
        }

        return () => (ignore = true)
    }, [message, onCancel, onConfirm])
}

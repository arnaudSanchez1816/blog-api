import { useCallback } from "react"
import { useSearchParams } from "react-router"

/**
 *
 * @callback SetParam
 * @param {any} newValue
 */

/**
 *
 * @returns {[param: any, setParam: SetParam]}
 */
export default function useParamSearchParams(paramName, defaultValue) {
    const [searchParams, setSearchParams] = useSearchParams()

    const param = searchParams.get(paramName) || defaultValue

    const setParam = useCallback(
        (newValue) => {
            setSearchParams(
                (previousParams) => {
                    const newParams = new URLSearchParams(previousParams)
                    newParams.set(paramName, newValue)

                    return newParams
                },
                { replace: true }
            )
        },
        [setSearchParams, paramName]
    )

    return [param, setParam]
}

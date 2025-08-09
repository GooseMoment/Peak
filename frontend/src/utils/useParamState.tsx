import {
    type Dispatch,
    type SetStateAction,
    useCallback,
    useEffect,
    useMemo,
} from "react"
import { useParams } from "react-router-dom"

interface useParamStateProps<T> {
    /** Indicates the name of the param. */
    name: string
    /** Returns the fallback data. Called when {@link convert} returns `undefined`. */
    fallback: () => T
    /** Returns `T` if the data can be converted into `T`. Returns `undefined` otherwise. */
    convert: (param: string | undefined) => T | undefined
    /** Called with the {@link fallback} data when {@link convert} returns `undefined`. */
    navigate: (value: T, fallback: boolean) => void
}

export default function useParamState<T>({
    name,
    fallback,
    navigate,
    convert,
}: useParamStateProps<T>): [T, Dispatch<SetStateAction<T>>] {
    const param = useParams()[name]

    const convertedValue = useMemo(() => convert(param), [param, convert])
    const fallbackValue = useMemo(() => fallback(), [fallback])
    const state = convertedValue !== undefined ? convertedValue : fallbackValue

    useEffect(() => {
        if (convertedValue === undefined) {
            navigate(fallbackValue, true)
        }
    }, [convertedValue, navigate, fallbackValue])

    const setValue = useCallback<Dispatch<SetStateAction<T>>>(
        (action) => {
            const newValue =
                typeof action === "function"
                    ? (action as (prevState: T) => T)(state)
                    : action

            if (newValue === state) {
                return
            }

            navigate(newValue, false)
        },
        [state, navigate],
    )

    return [state, setValue]
}

import { useMemo } from "react"
import { type Dispatch, type SetStateAction } from "react"
import { useParams } from "react-router-dom"

interface useParamStateProps<T> {
    /** Indicates the name of the param. */
    name: string
    /** Returns the fallback data. Called when {@link convert} returns `undefined`. */
    fallback: () => T
    /** Returns `T` if the data can be converted into `T`. Returns `undefined` otherwise. */
    convert: (param: string | undefined) => T | undefined
    /** Called with the {@link fallback} data when {@link convert} returns `undefined`. */
    navigate: (value: T) => void
}

export default function useParamState<T>({
    name,
    fallback,
    navigate,
    convert,
}: useParamStateProps<T>): [T, Dispatch<SetStateAction<T>>] {
    const param = useParams()[name]

    const value = useMemo(() => convert(param), [param])
    const setValue = useMemo(
        () => (action: SetStateAction<T>) => {
            if (typeof action === "function") {
                const newValue = (action as (prev: T) => T)(value!)
                navigate(newValue)
                return
            }

            if (action === value) {
                return
            }

            navigate(action)
        },
        [param],
    )

    if (value === undefined) {
        const data = fallback()
        navigate(data)
        return [data, setValue]
    }

    return [value, setValue]
}

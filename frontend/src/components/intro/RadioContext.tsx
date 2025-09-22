import { InputHTMLAttributes, createContext } from "react"

interface RadioContextType {
    value?: InputHTMLAttributes<HTMLInputElement>["value"]
    onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"]
    disabled?: InputHTMLAttributes<HTMLInputElement>["disabled"]
}

const RadioContext = createContext<RadioContextType | undefined>(undefined)

export default RadioContext
// code from https://www.daleseo.com/react-radio-buttons/

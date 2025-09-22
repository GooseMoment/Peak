import { InputHTMLAttributes, ReactNode } from "react"

import styled from "styled-components"

import RadioContext from "./RadioContext"

interface RadioGroupProps {
    label: string
    children: ReactNode
    value?: InputHTMLAttributes<HTMLInputElement>["value"]
    onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"]
    disabled?: InputHTMLAttributes<HTMLInputElement>["disabled"]
}

export default function RadioGroup({
    label,
    children,
    ...rest
}: RadioGroupProps) {
    return (
        <fieldset>
            <Legend>{label}</Legend>
            <RadioContext.Provider value={rest}>
                {children}
            </RadioContext.Provider>
        </fieldset>
    )
}

const Legend = styled.legend`
    margin-bottom: 0.25em;
`

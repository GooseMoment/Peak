import {
    InputHTMLAttributes,
    ReactNode,
    createContext,
    useContext,
} from "react"

import styled from "styled-components"

interface RadioContextType {
    value?: InputHTMLAttributes<HTMLInputElement>["value"]
    onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"]
    disabled?: InputHTMLAttributes<HTMLInputElement>["disabled"]
}

const RadioContext = createContext<RadioContextType | undefined>(undefined)

interface RadioProps {
    children: ReactNode
    value: string
    name?: string
    defaultChecked?: boolean
    disabled?: boolean
}

export default function Radio({
    children,
    value,
    name,
    defaultChecked,
    disabled,
}: RadioProps) {
    const group = useContext(RadioContext)
    const checked =
        group?.value !== undefined ? value === group.value : undefined

    return (
        <Label $checked={checked}>
            <RadioInput
                type="radio"
                value={value}
                name={name}
                defaultChecked={defaultChecked}
                disabled={disabled || group?.disabled}
                checked={checked}
                onChange={group?.onChange}
            />
            {children}
        </Label>
    )
}

const Label = styled.label<{ $checked?: boolean }>`
    display: flex;
    align-items: center;
    gap: 0.25em;
    margin-top: 1em;

    color: ${(p) => (p.$checked ? p.theme.accentColor : p.theme.textColor)};
    font-weight: ${(p) => (p.$checked ? 800 : 400)};

    cursor: pointer;

    &:hover {
        color: ${(p) => p.theme.accentColor};
    }
`

const RadioInput = styled.input`
    visibility: hidden;
`

interface RadioGroupProps {
    label: string
    children: ReactNode
    value?: InputHTMLAttributes<HTMLInputElement>["value"]
    onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"]
    disabled?: InputHTMLAttributes<HTMLInputElement>["disabled"]
}

export function RadioGroup({ label, children, ...rest }: RadioGroupProps) {
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

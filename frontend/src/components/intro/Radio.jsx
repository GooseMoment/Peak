import { useContext } from "react"

import RadioContext from "./RadioContext"

import styled from "styled-components"

const Radio = ({ children, value, name, defaultChecked, disabled }) => {
    const group = useContext(RadioContext)
    const checked = group.value !== undefined ? value === group.value : undefined

    return (
        <Label $checked={checked}>
            <RadioInput
                type="radio"
                value={value}
                name={name}
                defaultChecked={defaultChecked}
                disabled={disabled || group.disabled}
                checked={checked}
                onChange={(e) => group.onChange && group.onChange(e.target.value)}
            />
            {children}
        </Label>
    )
}

const Label = styled.label`
    display: block;
    margin-top: 1em;

    color: ${p => p.$checked ? p.theme.accentColor : p.theme.textColor};
    font-weight: ${p => p.$checked ? 800 : 400};

    cursor: pointer;
`

const RadioInput = styled.input`
    visibility: hidden;
`

export default Radio

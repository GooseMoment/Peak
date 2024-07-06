import { useContext } from "react"

import RadioContext from "./RadioContext"

import styled from "styled-components"

const Radio = ({ children, value, name, defaultChecked, disabled }) => {
    const group = useContext(RadioContext)
    return (
        <Label>
            <input
                type="radio"
                value={value}
                name={name}
                defaultChecked={defaultChecked}
                disabled={disabled || group.disabled}
                checked={group.value !== undefined ? value === group.value : undefined}
                onChange={(e) => group.onChange && group.onChange(e.target.value)}
            />
            {children}
        </Label>
    )
}

const Label = styled.label`
    display: block;
    margin-top: 1em;
`

export default Radio

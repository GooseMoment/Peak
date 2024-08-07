import styled from "styled-components"

import RadioContext from "./RadioContext"

const RadioGroup = ({ label, children, ...rest }) => {
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

export default RadioGroup

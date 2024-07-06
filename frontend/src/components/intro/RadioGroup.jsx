import styled from "styled-components"
import RadioContext from "./RadioContext"

const RadioGroup = ({ label, children, ...rest }) => {
    return (
        <fieldset>
            <Legend>{label}</Legend>
            <RadioContext.Provider value={rest}>{children}</RadioContext.Provider>
        </fieldset>
    )
}

const Legend = styled.legend`
    margin-bottom: 1em;
`

export default RadioGroup

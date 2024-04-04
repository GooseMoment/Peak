import { useState } from "react"

import { getClientSettings, setClientSettingsByName } from "@utils/clientSettings"

import styled from "styled-components"

const Select = ({settings=getClientSettings(), name, submit, choices, online=false}) => {
    const [value, setValue] = useState(settings[name])

    const onChange = e => {
        setValue(e.target.value)

        if (online) {
            let data = {}
            data[name] = e.target.value
            submit(data, {action: "..", method: "PATCH", navigate: false})
            return
        }

        setClientSettingsByName(name, e.target.value)
    }

    return <StyledSelect onChange={onChange} defaultValue={value}>
        {choices.map(
            choice => <option key={choice.value} value={choice.value}>{choice.display}</option>
        )}
    </StyledSelect>
}

const StyledSelect = styled.select`
    
`

export default Select

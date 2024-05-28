import { useState } from "react"

import { useClientSetting } from "@utils/clientSettings"

import styled from "styled-components"

const Select = ({name, submit, choices, onlineSetting}) => {
    const [clientSetting, setClientSetting] = useClientSetting()
    const [value, setValue] = useState(onlineSetting ? onlineSetting[name] : clientSetting[name])

    const onChange = e => {
        setValue(e.target.value)

        if (onlineSetting) {
            let data = {}
            data[name] = e.target.value
            submit(data)
            return
        }

        setClientSetting(name, e.target.value)
    }

    return <StyledSelect onChange={onChange} defaultValue={value}>
        {choices.map(
            choice => <option key={choice.value} value={choice.value}>{choice.display}</option>
        )}
    </StyledSelect>
}

// from: https://codepen.io/vkjgr/pen/VYMeXp
const StyledSelect = styled.select`
    color: ${p => p.theme.textColor};
    background-color: ${p => p.theme.backgroundColor};

    border: thin solid ${p => p.theme.textColor};
    border-radius: 4px;
    display: inline-block;
    font: inherit;
    line-height: 1.5em;
    padding: 0.5em 3.5em 0.5em 1em;

    margin: 0;      
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    background-image:
        linear-gradient(45deg, transparent 50%, gray 50%),
        linear-gradient(135deg, gray 50%, transparent 50%),
        linear-gradient(to right, #ccc, #ccc);
    background-position:
        calc(100% - 20px) calc(1em + 2px),
        calc(100% - 15px) calc(1em + 2px),
        calc(100% - 2.5em) 0.5em;
    background-size:
        5px 5px,
        5px 5px,
        1px 1.5em;
    background-repeat: no-repeat;

    &:focus {
        background-repeat: no-repeat;
        border-color: green;
        outline: 0;
    }
`

export default Select

import { useRef, useState } from "react"

import { getClientSettings, setClientSettingsByName } from "@utils/clientSettings"

import styled from "styled-components"

// from: https://velog.io/@fejigu/React-Toggle-Component-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0
const Switch = ({settings=getClientSettings(), submit, name, online=false}) => {
    const [value, setValue] = useState(settings[name])
    const timer = useRef(null)

    const sendChangeOnline = () => {
        let data = {}
        data[name] = value
        submit(data, {action: "..", method: "PATCH", navigate: false})
        timer.current = null
    }

    const onChange = e => {
        const checked = e.target.checked
        setValue(checked)

        if (!online) {
            setClientSettingsByName(name, checked)
            return
        }

        if (timer.current !== null) {
            clearTimeout(timer.current)
        }

        timer.current = setTimeout(sendChangeOnline, 1000)
    }

    return <ToggleSwitch>
        <CheckBox
            type="checkbox"
            checked={value}
            onChange={onChange}
        />
        <ToggleSlider />
    </ToggleSwitch>
}

const ToggleSwitch = styled.label`
    position: relative;
    display: inline-block;
    width: 47.7px;
    height: 23.33px;
`

const ToggleSlider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .2s;
    transition: .2s;
    border-radius: 34px;

    &:before {
        position: absolute;
        content: "";
        height: 15px;
        width: 15px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .2s;
        transition: .2s;
        border-radius: 50%;
    }
`

const CheckBox = styled.input`
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + ${ToggleSlider} {
        background-color: #ED6A2C;
    }

    &:focus + ${ToggleSlider} {
        box-shadow: 0 0 1px #2196F3;
    }

    &:checked + ${ToggleSlider}:before {
        -webkit-transform: translateX(24px);
        -ms-transform: translateX(24px);
        transform: translateX(24px);
    }
`

export default Switch
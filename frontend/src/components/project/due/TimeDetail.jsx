import { useState } from "react"
import styled, { css } from "styled-components"
import Button from "@components/common/Button"

const TimeDetail = () => {
    const [timezone, setTimezone] = useState(timezones[0].name)
    const [hour, setHour] = useState()
    const [min, setMin] = useState()

    const handleHour = (e) => {
        let validInputValue = e.target.value
        if (validInputValue.length > 2){
            validInputValue = e.target.value.slice("", 2)
        }
        if (validInputValue > 12){
            validInputValue = e.target.value.slice("", 1)
        }
        setHour(validInputValue)
    }

    const handleMin = (e) => {
        let validInputValue = e.target.value
        if (validInputValue.length > 2){
            validInputValue = e.target.value.slice("", 2)
        }
        if (validInputValue > 59){
            validInputValue = e.target.value.slice("", 1)
        }
        setMin(validInputValue)
    }

    return (
        <DetailBox>
            <FlexBox>
                <ToggleBox>
                    {timezones.map(t=>(
                        <TimezoneToggle $active={timezone == t.name} onClick={()=>{setTimezone(t.name)}}>
                            {t.display}
                        </TimezoneToggle>
                    ))}
                </ToggleBox>
                <InputBox>
                    <TimeInput
                        type="number"
                        maxLength={2}
                        value={hour}
                        onChange={handleHour}
                    />
                    <ColonContainer>:</ColonContainer>
                    <TimeInput
                        type="number"
                        maxLength={2}
                        value={min}
                        onChange={handleMin}
                    />
                </InputBox>
            </FlexBox>
            <FlexCenterBox>
                <Button onClick={()=>console.log(hour, min)}>추가하기</Button>
            </FlexCenterBox>
        </DetailBox>
    )
}

const DetailBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0.7em 0em;
`

const FlexBox = styled.div`
    display: flex;
    margin-top: 0.3em;
`

const FlexCenterBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.9em;
    margin-left: 0em;
`

const ToggleBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5em 0em;
    margin-top: 0.3em;
`

const TimezoneToggle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.5em;
    height: 1.7em;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;
    font-weight: 500;

    &:hover {
        cursor: pointer;
    }

    ${(props) =>
        props.$active && css`
            background-color: #FF4A03;
            border: solid 1px white;
            color: white;
        `
    }
`

const InputBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 1.1em;
    margin-top: 0.3em;
`

const ColonContainer = styled.div`
    font-size: 2em;
    margin: 0 0.3em;
`

const TimeInput = styled.input`
    width: 1.7em;
    height: 1.7em;
    font-size: 2em;
    text-align: center;
    background-color: #D9D9D9;
    color: black;

    &:focus {
        background-color: #FF4A03;
        color: white;
    }

    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
`

const timezones = [
    {name: "am", display: "오전"},
    {name: "pm", display: "오후"},
]

export default TimeDetail
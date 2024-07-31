import { useState } from "react"

import styled, { css } from "styled-components"
import { toast } from "react-toastify"

import Button from "@components/common/Button"
import { useClientSetting, useClientTimezone } from "@utils/clientSettings"

const TimeDetail = ({ due_date, setFunc, closeComponent }) => {
    const [setting, ] = useClientSetting()
    const due_tz = useClientTimezone()

    const [ampm, setAmpm] = useState(ampms[0].name)
    const [hour, setHour] = useState()
    const [min, setMin] = useState()

    const changeTime = () => {
        let converted_hour = !setting.time_as_24_hour && ampm === "pm" ? hour + 12 : hour
        const due_time = `${converted_hour}:${min}:00`
        setFunc({due_tz, due_date, due_time})
        closeComponent()
    }

    const handleHour = (e) => {
        let validInputValue = parseInt(e.target.value)
        if (setting.time_as_24_hour) {
            if (validInputValue > 23){
                toast.error("입력 가능한 최대 숫자는 23입니다", {toastId: "handle_hour"})
                validInputValue = validInputValue % 24
            }
            setHour(validInputValue)
        }
        else {
            if (validInputValue > 12){
                toast.error("입력 가능한 최대 숫자는 12입니다", {toastId: "handle_hour"})
                validInputValue = validInputValue % 12
            }
            setHour(validInputValue)
        }
    }

    const handleMinute = (e) => {
        let validInputValue = parseInt(e.target.value)
        if (validInputValue > 59){
            toast.error("입력 가능한 최대 숫자는 59입니다", {toastId: "handle_minute"})
            validInputValue = 59
        }
        setMin(validInputValue)
    }

    return (
        <DetailBox>
            <FlexBox>
                {setting.time_as_24_hour ||
                    <ToggleBox>
                        {ampms.map(t=>(
                            <AmpmToggle key={t.name} $active={ampm == t.name} onClick={()=>{setAmpm(t.name)}}>
                                {t.display}
                            </AmpmToggle>
                        ))}
                    </ToggleBox>}
                <InputBox>
                    <TimeInput
                        type="number"
                        value={hour ? hour : hour === 0 ? 0 : ''}
                        onChange={handleHour}
                    />
                    <ColonContainer>:</ColonContainer>
                    <TimeInput
                        type="number"
                        value={min ? min : min === 0 ? 0 : ''}
                        onChange={handleMinute}
                    />
                </InputBox>
            </FlexBox>
            <FlexCenterBox>
                <Button onClick={changeTime}>추가하기</Button>
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
    gap: 1.1em;
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

const AmpmToggle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.5em;
    height: 1.7em;
    background-color: ${p => p.theme.backgroundColor};
    border: solid 1px ${p => p.theme.project.lineColor};
    color: ${p => p.theme.textColor};
    border-radius: 15px;
    font-weight: 500;

    &:hover {
        cursor: pointer;
    }

    ${(props) =>
        props.$active && css`
            background-color: ${p => p.theme.goose};
            border: solid 1px ${p => p.theme.project.borderColor};
            color: ${p => p.theme.white};
        `
    }
`

const InputBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.3em;
`

const ColonContainer = styled.div`
    font-size: 2em;
    margin: 0 0.3em;
    color: ${p => p.theme.textColor};
`

const TimeInput = styled.input`
    width: 1.7em;
    height: 1.7em;
    font-size: 2em;
    text-align: center;
    background-color: ${p => p.theme.project.inputColor};
    color: ${p => p.theme.textColor};
    appearance: textfield;
    -moz-appearance: textfield;

    &:focus {
        background-color: ${p => p.theme.goose};
        color: ${p => p.theme.white};
    }

    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
`

const ampms = [
    {name: "am", display: "오전"},
    {name: "pm", display: "오후"},
]

export default TimeDetail
import { useState } from "react"
import FeatherIcon from "feather-icons-react"
import styled, { css } from "styled-components"
import Button from "@components/common/Button"

const TimeDetail = ({onClose}) => {
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
            <TitleBox>
                <Title>시간 추가</Title>
                <FeatherIcon icon="x" onClick={onClose} />
            </TitleBox>
            <CLine />
            <FlexBox>
                <ToggleBox>
                    {timezones.map(t=>(
                        <TimezoneToggle $active={timezone == t.name} onClick={()=>{setTimezone(t.name)}}>
                            <ToggleText>{t.display}</ToggleText>
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
                <AddButton onClick={()=>console.log(hour, min)}>추가하기</AddButton>
            </FlexCenterBox>
        </DetailBox>
    )
}

const DetailBox = styled.div`
    z-index: 999;
    width: 15em;
    height: auto;
    max-height: 30em;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;
    padding-bottom: 20px;

    &::-webkit-scrollbar {
        width: 13px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: gray;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-track {
        background-color: #D9D9D9;
        border-radius: 10px;
    }
`

const TitleBox = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 1.3em;

    & svg {
        width: 1em;
        height: 1em;
        stroke: #FF0000;
        top: 1.2em;
        cursor: pointer;
    }
`

const Title = styled.div`
    font-weight: 550;
    font-size: 1em;
    color: #000000;
    margin-top: 1.3em;
`

const CLine = styled.div`
    border-top: thin solid #D9D9D9;
    width: 12.5em;
    margin-top: 1em;
    margin-left: 1em;
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
    margin-left: 1.1em;
    margin-top: 0.3em;
`

const TimezoneToggle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.4em;
    height: 1.6em;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;

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

const ToggleText = styled.div`
    font-weight: 500;
`

const InputBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 1.1em;
    margin-top: 0.3em;
`

const ColonContainer = styled.div`
    font-size: 1.8em;
    margin: 0 0.3em;
`

const TimeInput = styled.input`
    width: 1.5em;
    height: 1.5em;
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

const AddButton = styled(Button)`
    font-size: 0.9em;
`

const timezones = [
    {name: "am", display: "오전"},
    {name: "pm", display: "오후"},
]

export default TimeDetail
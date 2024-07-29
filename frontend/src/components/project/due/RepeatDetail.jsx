import { useState } from "react"
import styled, { css } from "styled-components"
import Button from "@components/common/Button"

import everyday from "@assets/project/repeat/everyday.svg"
import everyweek from "@assets/project/repeat/everyweek.svg"
import everymonth from "@assets/project/repeat/everymonth.svg"
import everyyear from "@assets/project/repeat/everyyear.svg"
import weekday from "@assets/project/repeat/weekday.svg"
import weekend from "@assets/project/repeat/weekend.svg"
import { toast } from "react-toastify"

const RepeatDetail = () => {
    const [quick, setQuick] = useState("")
    const [week, setWeek] = useState(0)
    const [days, setDays] = useState([])

    const handleQuick = (q) => {
        if (quick == q) setQuick("")
        else setQuick(q)
    }

    const handleWeek = (e) => {
        const inputValue = e.target.value
        let validInputValue = parseInt(inputValue)
        if (validInputValue > 128){
            toast.error("입력 가능한 최대 숫자는 128입니다", {toastId: "handle_week"})
            validInputValue = 128
        }
        setWeek(validInputValue)
    }

    const handleDays = (selectedDay) => {
        if (days.includes(selectedDay)) {
            setDays(days.filter(day => day !== selectedDay))
        }
        else {
            setDays([...days, selectedDay])
        }
    }

    return (
        <DetailBox>
            <ButtonFlexBox>
            {quickButtons.map(quickButton=>(
                <ButtonBox key={quickButton.display} $active={quick == quickButton.display} onClick={()=>handleQuick(quickButton.display)}>
                    <img src={quickButton.src}/>
                    {quickButton.display}
                </ButtonBox>))}
            </ButtonFlexBox>
            <CLine/>
            <FlexCenterBox>
                <WeekInput
                    type="number"
                    value={week}
                    onChange={handleWeek}
                />
                <TextContainer>주 마다</TextContainer>
            </FlexCenterBox>
            <FlexCenterBox>
            {daysOfWeek.map((day)=>(
                <Circle 
                    key={day.name} 
                    $isFirst={day.name== "sun"}
                    $active={days.includes(day.name)}
                    onClick={()=>handleDays(day.name)}
                >
                    {day.display}
                </Circle>
            ))}
            </FlexCenterBox>
            <FlexCenterBox>
                <Button onClick={()=>console.log(week, days)}>추가하기</Button>
            </FlexCenterBox>
        </DetailBox>
    )
}

const quickButtons = [
    {display: "매일", src: everyday},
    {display: "매주", src: everyweek},
    {display: "매달", src: everymonth},
    {display: "매년", src: everyyear},
    {display: "평일", src: weekday},
    {display: "주말", src: weekend},
]

const daysOfWeek = [
    {name: "sun", display: "일"},
    {name: "mon", display: "월"},
    {name: "tue", display: "화"},
    {name: "wed", display: "수"},
    {name: "thu", display: "목"},
    {name: "fri", display: "금"},
    {name: "sat", display: "토"},
]

const DetailBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 1em;
`

const CLine = styled.div`
    border-top: thin solid ${p => p.theme.project.lineColor};
    width: 90%;
    margin: 1em 0em;
`

const FlexCenterBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.9em;
    margin-left: 0em;
`

const ButtonFlexBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: 0.3em;
    gap: 0.5em;
`

const ButtonBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.4em;
    width: 28%;
    height: 1.7em;
    border-radius: 13px;
    border: solid 1px ${p => p.theme.project.borderColor};
    color: ${p => p.theme.textColor};
    font-weight: 500;

    &:hover {
        cursor: pointer;
        font-weight: bolder;
    }

    ${(props) =>
        props.$active && css`
            background-color: ${p => p.theme.goose};
            border: solid 1px ${p => p.theme.project.borderColor};
            color: ${p => p.theme.backgroundColor};
        `
    }
`

const TextContainer = styled.div`
    font-weight: 450;
    font-size: 1.6em;
    margin: 0 0.3em;
    color: ${p => p.theme.textColor};
`

const WeekInput = styled.input`
    width: 2em;
    height: 1.6em;
    font-size: 1.6em;
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

const Circle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1.7em;
    aspect-ratio: 1;
    font-weight: 480;
    color: ${p => p.theme.textColor};
    border: solid 1px ${p => p.theme.project.lineColor};
    border-radius: 50%;
    margin-left: ${(props)=>props.$isFirst ? 0 : 0.3}em;

    &:hover {
        cursor: pointer;
    }

    ${(props) =>
        props.$active && css`
            background-color: ${p => p.theme.goose};
            border: solid 1px white;
            color: white;
        `
    }
`

export default RepeatDetail
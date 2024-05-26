import { useState } from "react"
import FeatherIcon from "feather-icons-react"
import styled, { css } from "styled-components"
import Button from "@components/common/Button"

import everyday from "@assets/project/repeat/everyday.svg"
import everyweek from "@assets/project/repeat/everyweek.svg"
import everymonth from "@assets/project/repeat/everymonth.svg"
import everyyear from "@assets/project/repeat/everyyear.svg"
import weekday from "@assets/project/repeat/weekday.svg"
import weekend from "@assets/project/repeat/weekend.svg"

const RepeatDetail = ({onClose}) => {
    const [quick, setQuick] = useState("")
    const [week, setWeek] = useState(0)
    const [days, setDays] = useState([])

    const handleQuick = (q) => {
        if (quick == q) setQuick("")
        else setQuick(q)
    }

    const handleWeek = (e) => {
        let validInputValue = e.target.value
        if (validInputValue > 128){
            if (validInputValue.length() > 2)
                validInputValue = e.target.value.slice("", 3)
            else
                validInputValue = e.target.value.slice("", 2)
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
            <TitleBox>
                <Title>반복 설정</Title>
                <FeatherIcon icon="x" onClick={onClose} />
            </TitleBox>
            <CLine/>
            <ButtonFlexBox>
            {quickButtons.map(quickButton=>(
                <ButtonBox key={quickButton.display} $active={quick == quickButton.display} onClick={()=>handleQuick(quickButton.display)}>
                    <img src={quickButton.src}/>
                    {quickButton.display}
                </ButtonBox>))}
            </ButtonFlexBox>
            <CLine/>
            <FlexCenterBox>
                <InputBox>
                    <WeekInput
                        type="number"
                        maxLength={2}
                        value={week}
                        onChange={handleWeek}
                    />
                    <TextContainer>주 마다</TextContainer>
                </InputBox>
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
                <AddButton onClick={()=>console.log(week, days)}>추가하기</AddButton>
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
    z-index: 999;
    width: 17em;
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
    width: 15em;
    margin-top: 1em;
    margin-left: 1em;
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
    margin-top: 1em;
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
    border: solid 1px #D9D9D9;
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

const InputBox = styled(FlexCenterBox)`
    margin-top: 0.3em;
`

const TextContainer = styled.div`
    font-weight: 450;
    font-size: 1.6em;
    margin: 0 0.3em;
`

const WeekInput = styled.input`
    width: 2em;
    height: 1.6em;
    font-size: 1.6em;
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

const Circle = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1.7em;
    aspect-ratio: 1;
    font-weight: 480;
    border: solid 1px #D9D9D9;
    border-radius: 50%;
    margin-left: ${(props)=>props.$isFirst ? 0 : 0.3}em;

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

const AddButton = styled(Button)`
    font-size: 0.9em;
`

export default RepeatDetail
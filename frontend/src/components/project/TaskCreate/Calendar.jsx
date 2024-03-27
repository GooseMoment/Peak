import FeatherIcon from "feather-icons-react"
import styled from "styled-components"

import DetailFrame from "./DetailFrame"

import today from "@/assets/project/calendar/today.svg"
import tomorrow from "@/assets/project/calendar/tomorrow.svg"
import next_week from "@/assets/project/calendar/next_week.svg"
import repeat from "@/assets/project/calendar/repeat.svg"
import slach from "@/assets/project/slach.svg"

const Calendar = ({ onClose }) => {
    return (
        <DetailFrame title="기한 지정" onClose={onClose}>
            {items.map(item => (
                <ItemBlock key={item.id}>
                    {item.icon}
                    <ItemText>{item.content}</ItemText>
                </ItemBlock>
            ))}
            <CLine />
            <div>달력이 들어갈 자리입니다</div>
            <CLine />
            <AddTime>
                <AddTimeText>
                    <FeatherIcon icon="clock" />
                    시간 추가
                </AddTimeText>
            </AddTime>
        </DetailFrame>
    )
}

const CLine = styled.div`
    border-top: thin solid #D9D9D9;
    width: 12.5em;
    margin-top: 1em;
    margin-bottom: 0.3em;
    margin-left: 1em;
`

const ItemBlock = styled.div`
    display: flex;
    gap: 0.5em;
    align-items: center;
    margin-left: 1.2em;
    margin-top: 1.2em;
`

const ItemText = styled.p`
    font-weight: normal;
    font-size: 1em;
    color: #000000;

    &:hover {
        font-weight: bolder;
        color: #FF4A03;
        cursor: pointer;
    }
`

const AddTime = styled.div`
    display: flex;
    justify-content: center;
    width: 14em;
    height: 1.8em;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;
    margin: 0.5em 0.5em;
`

const AddTimeText = styled.p`
    color: #000000;
    font-size: 1em;
    
    & svg {
        width: 1.2em;
        height: 1.2em;
        top: 0.3em;
    }
`

const items = [
    {id: 0, icon: <img src={today}/>, content: "오늘"},
    {id: 1, icon: <img src={tomorrow}/>, content: "내일"},
    {id: 2, icon: <img src={next_week}/>, content: "다음 주"},
    {id: 3, icon: <img src={repeat}/>, content: "반복"},
    {id: 4, icon: <img src={slach}/>, content: "날짜없음"},
]

export default Calendar
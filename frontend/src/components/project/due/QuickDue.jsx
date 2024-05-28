import styled from "styled-components"

import today from "@assets/project/calendar/today.svg"
import tomorrow from "@assets/project/calendar/tomorrow.svg"
import next_week from "@assets/project/calendar/next_week.svg"
import slach from "@assets/project/slach.svg"

const QuickDue = ({changeDueDate}) => {
    const items = [
        {id: 0, icon: <img src={today}/>, display: "오늘", set: 0},
        {id: 1, icon: <img src={tomorrow}/>, display: "내일", set: 1},
        {id: 2, icon: <img src={next_week}/>, display: "다음 주", set: 7},
        {id: 3, icon: <img src={next_week}/>, display: "2주 뒤", set: 14},
        {id: 4, icon: <img src={next_week}/>, display: "한달 뒤", set: 30},
        {id: 5, icon: <img src={slach}/>, display: "날짜없음", set: null},
    ]
    
    return (
        <ButtonFlexBox>
        {items.map(item=>(
            <ButtonBox key={item.id} onClick={changeDueDate(item.set)}>
                {item.icon}
                {item.display}
            </ButtonBox>))}
        </ButtonFlexBox>
    )
}

const ButtonFlexBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: 0.5em;
    margin-top: 1em;
    gap: 0.8em;
`

const ButtonBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.4em;
    width: 40%;
    height: 1.7em;
    border-radius: 13px;
    border: solid 1px #D9D9D9;
    font-weight: 500;

    &:hover {
        font-weight: bolder;
        color: #FF4A03;
        cursor: pointer;
    }
`

export default QuickDue
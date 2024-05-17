import styled from "styled-components"

import Detail from "@components/project/common/Detail"

import today from "@assets/project/calendar/today.svg"
import tomorrow from "@assets/project/calendar/tomorrow.svg"
import next_week from "@assets/project/calendar/next_week.svg"
import slach from "@assets/project/slach.svg"

const Assigned = ({setFunc, closeComponent}) => {
    let date = new Date()

    const items = [
        {id: 0, icon: <img src={today}/>, content: "오늘", set: 0},
        {id: 1, icon: <img src={tomorrow}/>, content: "내일", set: 1},
        {id: 2, icon: <img src={next_week}/>, content: "다음 주", set: 7},
        {id: 3, icon: <img src={next_week}/>, content: "2주 뒤", set: 14},
        {id: 4, icon: <img src={slach}/>, content: "날짜없음", set: null},
    ]

    const changeAssignedDate = (set) => {
        return async () => {
            date.setDate(date.getDate() + set)
            let assigned_at = null
            if (!(set === null)) {
                assigned_at = date.toISOString().slice(0, 10)
            }
            setFunc({assigned_at})
            closeComponent()
        }
    }

    return (
        <Detail title="할당 날짜 설정" onClose={closeComponent}>
            {items.map(item => (
                <ItemBlock key={item.id}>
                    {item.icon}
                    <ItemText onClick={changeAssignedDate(item.set)}>{item.content}</ItemText>
                </ItemBlock>
            ))}
            <CLine />
            <div>달력이 들어갈 자리입니다</div>
        </Detail>
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

export default Assigned
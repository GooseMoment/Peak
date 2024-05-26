import { Fragment, useState } from "react"

import FeatherIcon from "feather-icons-react"
import styled from "styled-components"

import Detail from "@components/project/common/Detail"
import ModalPortal from "@components/common/ModalPortal"
import TimeDetail from "@components/project/TimeDetail"
import RepeatDetail from "@components/project/RepeatDetail"

import today from "@assets/project/calendar/today.svg"
import tomorrow from "@assets/project/calendar/tomorrow.svg"
import next_week from "@assets/project/calendar/next_week.svg"
import slach from "@assets/project/slach.svg"

const Calendar = ({setFunc, closeComponent}) => {
    const [isAdditionalComp, setIsAdditionalComp] = useState()

    const closeAdditionalComp = () => {
        setIsAdditionalComp(false)
    }

    let date = new Date()

    const items = [
        {id: 0, icon: <img src={today}/>, content: "오늘", set: 0},
        {id: 1, icon: <img src={tomorrow}/>, content: "내일", set: 1},
        {id: 2, icon: <img src={next_week}/>, content: "다음 주", set: 7},
        {id: 3, icon: <img src={next_week}/>, content: "2주 뒤", set: 14},
        {id: 4, icon: <img src={slach}/>, content: "날짜없음", set: null},
    ]

    const addComponent = [
        {name: "time", display: "시간 추가", icon: "clock", component: <TimeDetail onClose={closeAdditionalComp}/>},
        {name: "repeat", display: "반복 설정", icon: "refresh-cw", component: <RepeatDetail onClose={closeAdditionalComp}/>},
    ]

    const changeDueDate = (set) => {
        return async () => {
            date.setDate(date.getDate() + set)
            let due_date = null
            if (!(set === null)) {
                due_date = date.toISOString().slice(0, 10)
            }
            setFunc({due_date})
            closeComponent()
        }
    }

    return (
        <Detail title="기한 지정" onClose={closeComponent}>
            {items.map(item => (
                <ItemBlock key={item.id}>
                    {item.icon}
                    <ItemText onClick={changeDueDate(item.set)}>{item.content}</ItemText>
                </ItemBlock>
            ))}
            <CLine />
            <div>달력이 들어갈 자리입니다</div>
            {addComponent.map((comp)=>(
                <Fragment key={comp.name}>
                    <CLine />
                    <AddButton>
                        <AddButtonText onClick={() => setIsAdditionalComp(comp.name)}>
                            <FeatherIcon icon={comp.icon}/>
                            {comp.display}
                        </AddButtonText>
                    </AddButton>
                    {isAdditionalComp === comp.name &&
                    <ModalPortal closeModal={closeAdditionalComp} additional>
                        {comp.component}
                    </ModalPortal>}
                </Fragment>
            ))}
        </Detail>
    )
}

const CLine = styled.div`
    border-top: thin solid #D9D9D9;
    width: 12.5em;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
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

const AddButton = styled.div`
    display: flex;
    justify-content: center;
    width: 14em;
    height: 1.8em;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;
    margin: 0.5em 0.5em;
`

const AddButtonText = styled.p`
    color: #000000;
    font-size: 1em;

    &:hover {
        font-weight: bolder;
        color: #FF4A03;
        cursor: pointer;

        & svg {
            color: #000000;
        }
    }
    
    & svg {
        width: 1.2em;
        height: 1.2em;
        top: 0.3em;
    }
    
`

export default Calendar
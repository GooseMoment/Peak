import FeatherIcon from "feather-icons-react"
import styled from "styled-components"

import DetailFrame from "./DetailFrame"

const Calendar = ({ onClose }) => {
    return (
        <DetailFrame title="기한 지정" onClose={onClose}>
            {items.map(item => (
                <ItemBlock key={item.id}>
                    <Circle>
                        <FeatherIcon icon={item.icon} />
                    </Circle>
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
    justify-content: flex-start;
    margin-left: 1.2em;
`

const Circle = styled.div`
    position: relative;
    width: 1.3em;
    height: 1.3em;
    background-color: #FF4A03;
    margin-top: 1em;
    border-radius: 50%;
    
    & svg {
        position: absolute;
        width: 1em;
        height: 1em;
        stroke-width: 3px;
        stroke: #FFFFFF;
        top: 2px;
        left: 2.5px;
    }
`

const ItemText = styled.p`
    font-weight: normal;
    font-size: 1em;
    color: #000000;
    margin-top: 1.05em;
    margin-left: 0.7em;

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
    {id: 0, icon: "arrow-down", content: "오늘"},
    {id: 1, icon: "arrow-right", content: "내일"},
    {id: 2, icon: "chevrons-right", content: "다음 주"},
    {id: 3, icon: "rotate-cw", content: "반복"},
    {id: 4, icon: "slash", content: "날짜없음"},
]

export default Calendar
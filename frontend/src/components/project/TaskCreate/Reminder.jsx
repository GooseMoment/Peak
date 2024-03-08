import FeatherIcon from "feather-icons-react"
import styled from "styled-components"

import DetailFrame from "./DetailFrame"

const Reminder = ({ onClose }) => {
    return (
        <DetailFrame title="알람 설정" onClose={onClose}>
            {items.map(item => (
                <ItemBlock key={item.id}>
                    <FeatherIcon icon={item.icon} />
                    <ItemText>{item.content}</ItemText>
                </ItemBlock>
            ))}
        </DetailFrame>
    )
}

const ItemBlock = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-left: 1.2em;

    & svg {
        stroke: #FF4A03;
        top: 1.2em;
    }
`

const ItemText = styled.p`
    font-weight: normal;
    font-size: 1em;
    color: #000000;
    margin-top: 1.3em;

    &:hover {
        font-weight: bolder;
        color: #FF4A03;
        cursor: pointer;
    }
`

const items = [
    {id: 0, icon: "clock", content: "5분 전"},
    {id: 1, icon: "clock", content: "15분 전"},
    {id: 2, icon: "clock", content: "30분 전"},
    {id: 3, icon: "clock", content: "1시간 전"},
    {id: 4, icon: "clock", content: "당일"},
    {id: 5, icon: "clock", content: "1일 전"},
    {id: 6, icon: "clock", content: "2일 전"},
    {id: 7, icon: "clock", content: "사용자 지정"},
]

export default Reminder
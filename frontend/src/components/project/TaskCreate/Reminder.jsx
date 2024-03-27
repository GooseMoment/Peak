import FeatherIcon from "feather-icons-react"
import styled from "styled-components"

import DetailFrame from "./DetailFrame"

import before_5 from "@/assets/project/reminder/before_5.svg"
import before_15 from "@/assets/project/reminder/before_15.svg"
import before_30 from "@/assets/project/reminder/before_30.svg"
import before_1h from "@/assets/project/reminder/before_1h.svg"
import before_D from "@/assets/project/reminder/before_D.svg"
import before_1D from "@/assets/project/reminder/before_1D.svg"
import before_2D from "@/assets/project/reminder/before_2D.svg"
import custom from "@/assets/project/reminder/custom.svg"

const Reminder = ({ onClose }) => {
    return (
        <DetailFrame title="알람 설정" onClose={onClose}>
            {items.map(item => (
                <ItemBlock key={item.id}>
                    {item.icon}
                    <ItemText>{item.content}</ItemText>
                </ItemBlock>
            ))}
        </DetailFrame>
    )
}

const ItemBlock = styled.div`
    display: flex;
    gap: 0.5em;
    align-items: center;
    margin-left: 1.2em;
    margin-top: 1.2em;

    & svg {
        stroke: #FF4A03;
        top: 1.2em;
    }
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

const items = [
    {id: 0, icon: <img src={before_5}/>, content: "5분 전"},
    {id: 1, icon: <img src={before_15}/>, content: "15분 전"},
    {id: 2, icon: <img src={before_30}/>, content: "30분 전"},
    {id: 3, icon: <img src={before_1h}/>, content: "1시간 전"},
    {id: 4, icon: <img src={before_D}/>, content: "당일"},
    {id: 5, icon: <img src={before_1D}/>, content: "1일 전"},
    {id: 6, icon: <img src={before_2D}/>, content: "2일 전"},
    {id: 7, icon: <img src={custom}/>, content: "사용자 지정"},
]

export default Reminder
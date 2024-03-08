import FeatherIcon from "feather-icons-react"
import styled from "styled-components"
import DetailFrame from "./DetailFrame"

const Priority = ({ onClose }) => {
    return (
        <DetailFrame title="중요도 설정" onClose={onClose}>
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
    {id: 0, icon: "alert-circle", content: "보통"},
    {id: 1, icon: "alert-circle", content: "중요"},
    {id: 2, icon: "alert-circle", content: "매우 중요"},
]

export default Priority
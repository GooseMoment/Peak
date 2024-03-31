import styled from "styled-components"

import DetailFrame from "@components/project/common/DetailFrame"

import goal from "@assets/project/type/goal.svg"
import regular from "@assets/project/type/regular.svg"

const Type = ({closeComponent}) => {
    return (
        <DetailFrame title="프로젝트 설정" onClose={closeComponent}>
            {items.map(item => (
                <ItemBlock key={item.id}>
                    {item.icon}
                    <ItemText>{item.display}</ItemText>
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
        width: 1.2em;
        height: 1.2em;
        stroke: none;
        top: 0;
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
    {icon: <img src={regular}/>, display: "상시 프로젝트"},
    {icon: <img src={goal}/>, display: "목표 프로젝트"}
]

export default Type
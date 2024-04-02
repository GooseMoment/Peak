import styled from "styled-components"

import DetailFrame from "@components/project/common/Detail"

import goal from "@assets/project/type/goal.svg"
import regular from "@assets/project/type/regular.svg"

const Type = ({setType, setDisplayType, closeComponent}) => {

    const changeType = (type, displaytype) => {
        return async () => {
            await setType(type)
            await setDisplayType(displaytype)
            closeComponent()
        }
    }

    return (
        <DetailFrame title="프로젝트 설정" onClose={closeComponent}>
            {items.map(item => (
                <ItemBlock key={item.id}>
                    {item.icon}
                    <ItemText onClick={changeType(item.type, item.display)}>{item.display}</ItemText>
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
    {icon: <img src={regular}/>, display: "상시 프로젝트", type: "regular"},
    {icon: <img src={goal}/>, display: "목표 프로젝트", type: "goal"}
]

export default Type
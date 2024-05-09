import styled from "styled-components"

import Detail from "@components/project/common/Detail"

import normal from "@assets/project/priority/normal.svg"
import important from "@assets/project/priority/important.svg"
import critical from "@assets/project/priority/critical.svg"

const Priority = ({setFunc, closeComponent}) => {

    const changePriority = (priority) => {
        return async () => {
            setFunc({priority})
            closeComponent()
        }
    }

    return (
        <Detail title="중요도 설정" onClose={closeComponent}>
            {items.map(item => (
                <ItemBlock key={item.id}>
                    {item.icon}
                    <ItemText onClick={changePriority(item.id)}>{item.content}</ItemText>
                </ItemBlock>
            ))}
        </Detail>
    )
}

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

const items = [
    {id: 0, icon: <img src={normal}/>, content: "보통"},
    {id: 1, icon: <img src={important}/>, content: "중요"},
    {id: 2, icon: <img src={critical}/>, content: "매우 중요"},
]

export default Priority
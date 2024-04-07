import { useState } from "react"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import Detail from "@components/project/common/Detail"
import ModalPortal from "@components/common/ModalPortal"
import CustomColor from "./CustomColor"

const Color = ({setColor, setDisplayColor, closeComponent}) => {
    const [isCustomOpen, setIsCustomOpen] = useState(false)

    const openCustom = () => {
        setIsCustomOpen(true)
    }

    const closeCustom = () => {
        setIsCustomOpen(false)
    }

    const changeColor = (color, displayColor) => {
        return async () => {
            await setColor(color)
            await setDisplayColor(displayColor)
            closeComponent()
        }
    }

    return (
        <Detail title="색깔 설정" onClose={closeComponent}>
            {items.map(item => (
                <ItemBlock key={item.id}>
                    <FeatherIcon icon="circle" fill={'#'+item.color}/>
                    <ItemText onClick={(item.display === "사용자 지정") ? openCustom : changeColor(item.color, item.display)}>
                        {item.display}
                    </ItemText>
                    { item.display ===  "사용자 지정" && isCustomOpen ?
                    <ModalPortal closeModal={closeCustom} additional>
                        <CustomColor closeCustom={closeCustom} changeColor={changeColor}/>
                    </ModalPortal> : null }
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
    {color: "DC2E2E", display: "빨강"},
    {color: "FF4A03", display: "주황"},
    {color: "FFD703", display: "노랑"},
    {color: "26AA1B", display: "초록"},
    {color: "2E61DC", display: "파랑"},
    {color: "8F2EDC", display: "보라"},
    {color: "000000", display: "사용자 지정"},
]

export default Color
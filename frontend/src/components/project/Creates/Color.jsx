import { useState } from "react"

import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

import Detail from "@components/project/common/Detail"
import palettes from "./palettes"

const Color = ({setColor, setDisplayColor, closeComponent}) => {
    const [activeTab, setActiveTab] = useState('기본')
    const [usePalettes, setUsePalettes] = useState(palettes[0])

    const clickTab = (id, themeName) => {
        return async () => {
            setUsePalettes(palettes[id])
            setActiveTab(themeName)
        }}

    const changeColor = (color, displayColor) => {
        return async () => {
            await setColor(color)
            await setDisplayColor(displayColor)
            closeComponent()
        }
    }

    return (
        <Detail title="색깔 설정" onClose={closeComponent}>
            <TabBox>
            {themes.map(theme => (
                <TabButton
                    key={theme.themeName}
                    $isActive={activeTab === theme.themeName}
                    onClick={clickTab(theme.id, theme.themeName)}
                >
                    {theme.themeName}
                </TabButton>
            ))}
            </TabBox>
            {usePalettes.map(palette => (
                <ItemBlock>
                    <FeatherIcon icon="circle" fill={'#'+palette.color} onClick={changeColor(palette.color, palette.display)}/>
                </ItemBlock>
            ))}
        </Detail>
    )
}

const TabBox = styled.div`
    display: flex;
    margin-left: 0.4em;
    margin-top: 1em;
`

const TabButton = styled.button`
    font-weight: 400;
    font-size: 0.9em;
    padding: 0.3em;
    margin-left: 1em;
    width: 3em;
    border: 1px solid;
    border-radius: 15px;
    border-color: #${props => props.$isActive ? 'FFD7C7' : 'A4A4A4'};
    background-color: #${props => props.$isActive ? 'FF4A03' : 'FFFFFF'};
    color: #${props => props.$isActive ? 'FFFFFF' : '000000'};
    cursor: pointer;
`

const ItemBlock = styled.div`
    display: inline-block;
    margin-left: 1.4em;
    margin-top: 1.2em;

    & svg {
        width: 1.5em;
        height: 1.5em;
        stroke: none;
        top: 0;
        cursor: pointer;
    }
`

const themes = [
    {id: 0, themeName: '기본'},
    {id: 1, themeName: '여름'},
]

export default Color
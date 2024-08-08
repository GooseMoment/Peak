import { useState } from "react"

import styled, { css, useTheme } from "styled-components"

import Detail from "@components/project/common/Detail"

import palettes from "./palettes"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const Color = ({ setColor, closeComponent }) => {
    const { t } = useTranslation(null, { keyPrefix: "project.create.color" })
    const theme = useTheme()

    const [activeTab, setActiveTab] = useState("basic")

    const changeColor = (color) => {
        return () => {
            setColor(color)
    }}

    
    const themes = [
        {id: "basic", themeName: t("theme1")},
        {id: "summer", themeName: t("theme2")},
    ]

    return (
        <Detail title={t("title")} onClose={closeComponent}>
            <TabBox>
            {themes.map(theme => (
                <TabButton
                    key={theme.themeName}
                    $isActive={activeTab === theme.id}
                    onClick={() => setActiveTab(theme.id)}
                >
                    {theme.themeName}
                </TabButton>
            ))}
            </TabBox>
            {palettes[activeTab]?.map(palette => (
                <ItemBlock key={palette.display}>
                    <FeatherIcon icon="circle" fill={getProjectColor(theme.type, palette.color)} onClick={changeColor(palette.color)}/>
                </ItemBlock>
            ))}
        </Detail>
    )
}

const TabBox = styled.div`
    display: flex;
    margin-top: 1em;
    margin-left: 1em;
    gap: 0.8em;
`

const TabButton = styled.button`
    width: 3em;
    padding: 0.3em;
    font-size: 0.9em;
    font-weight: 500;
    border: 1px solid ${p=>p.theme.project.borderColor};
    border-radius: 15px;
    color: ${p=>p.theme.textColor};
    background-color: ${p=>p.theme.backgroundColor};
    cursor: pointer;

    ${props => props.$isActive && css`
        background-color: ${p=>p.theme.goose};
        color: ${p=>p.theme.white}
    `}
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

export default Color

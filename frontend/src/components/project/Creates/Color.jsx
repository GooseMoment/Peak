import { useState } from "react"

import styled, { css } from "styled-components"
import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

import Detail from "@components/project/common/Detail"
import palettes from "./palettes"

const Color = ({ setColor, setDisplayColor, closeComponent }) => {
    const { t } = useTranslation(null, { keyPrefix: "project.create.color" })

    const [activeTab, setActiveTab] = useState("기본")
    const [usePalettes, setUsePalettes] = useState(palettes[0])

    const clickTab = (id, themeName) => {
        return async () => {
            setUsePalettes(palettes[id])
            setActiveTab(themeName)
        }
    }

    const changeColor = (color, displayColor) => {
        return () => {
            setColor(color)
            setDisplayColor(displayColor)
            closeComponent()
        }
    }

    const themes = [
        { id: 0, themeName: t("theme1") },
        { id: 1, themeName: t("theme2") },
    ]

    return (
        <Detail title={t("title")} onClose={closeComponent}>
            <TabBox>
                {themes.map((theme) => (
                    <TabButton
                        key={theme.id}
                        $isActive={activeTab === theme.themeName}
                        onClick={clickTab(theme.id, theme.themeName)}
                    >
                        {theme.themeName}
                    </TabButton>
                ))}
            </TabBox>
            {usePalettes.map((palette) => (
                <ItemBlock>
                    <FeatherIcon
                        icon="circle"
                        fill={"#" + palette.color}
                        onClick={changeColor(palette.color, palette.display)}
                    />
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
    font-weight: 500;
    font-size: 0.9em;
    padding: 0.35em;
    margin-left: 1em;
    border: 1px solid;
    border-radius: 13px;
    border-color: ${(p) => p.theme.project.lineColor};
    background-color: ${(p) => p.theme.backgroundColor};
    color: ${(p) => p.theme.textColor};
    cursor: pointer;

    ${(props) =>
        props.$isActive &&
        css`
            background-color: ${(p) => p.theme.goose};
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

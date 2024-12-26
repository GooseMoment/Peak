import { useState } from "react"

import styled, { css, useTheme } from "styled-components"

import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import Detail from "@components/project/common/Detail"
import { getProjectColor, palettes } from "@components/project/common/palettes"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const Color = ({ setColor }) => {
    const { t } = useTranslation(null, {
        keyPrefix: "project_drawer_edit.color",
    })
    const theme = useTheme()

    const [activeTab, setActiveTab] = useState("theme1")

    const { closeModal } = useModalWindowCloseContext()

    const changeColor = (color) => {
        return () => {
            setColor({ color })
            closeModal()
        }
    }

    const themes = [
        { id: "theme1", themeName: t("theme1") },
    ]

    return (
        <Detail title={t("title")} onClose={closeModal}>
            <TabBox>
                {themes.map((theme) => (
                    <TabButton
                        key={theme.themeName}
                        $isActive={activeTab === theme.id}
                        onClick={() => setActiveTab(theme.id)}>
                        {theme.themeName}
                    </TabButton>
                ))}
            </TabBox>
            {palettes[activeTab]?.map((palette) => (
                <ItemBlock key={palette}>
                    <FeatherIcon
                        icon="circle"
                        fill={getProjectColor(theme.type, palette)}
                        onClick={changeColor(palette)}
                    />
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
    width: fit-content;
    padding: 0.4em 0.6em;
    font-size: 0.9em;
    font-weight: 500;
    border: 1px solid ${(p) => p.theme.project.borderColor};
    border-radius: 15px;
    color: ${(p) => p.theme.textColor};
    background-color: ${(p) => p.theme.backgroundColor};
    cursor: pointer;

    ${(props) =>
        props.$isActive &&
        css`
            background-color: ${(p) => p.theme.goose};
            color: ${(p) => p.theme.white};
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

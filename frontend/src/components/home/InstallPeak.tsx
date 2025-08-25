import styled from "styled-components"

import Module, { Center, CenteredText, Title } from "@components/home/Module"

import { useTranslation } from "react-i18next"

const isStandalone = window.matchMedia("(display-mode: standalone)").matches

const InstallPeak = () => {
    const { t } = useTranslation("home", { keyPrefix: "install_peak" })

    if (!("standalone" in window.navigator) || isStandalone) {
        return null
    }

    return (
        <Module to="/docs/install-instruction">
            <Title displayArrow underline>
                {t("title")}
            </Title>
            <Center>
                <AppIcon src="/logo.svg" draggable="false" />
            </Center>
            <CenteredText>{t("description")}</CenteredText>
        </Module>
    )
}

const AppIcon = styled.img`
    aspect-ratio: 1/1;
    height: 4.5em;
    border-radius: 16px;
    margin-left: auto;
    margin-right: auto;
`

export default InstallPeak

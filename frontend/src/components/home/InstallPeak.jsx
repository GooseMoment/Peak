import styled from "styled-components"

import Module, { CenteredText, Title } from "@components/home/Module"

import { useTranslation } from "react-i18next"

const InstallPeak = () => {
    const { t } = useTranslation("home", { keyPrefix: "install_peak" })

    return (
        <Module>
            <Title to="/docs/install-instruction" underline>
                {t("title")}
            </Title>
            <IconWrapper>
                <AppIcon src="/logo.svg" draggable="false" />
            </IconWrapper>
            <CenteredText>{t("description")}</CenteredText>
        </Module>
    )
}

const IconWrapper = styled.div`
    display: flex;
    justify-content: center;

    width: 100%;

    margin: 1em 0;
`

const AppIcon = styled.img`
    aspect-ratio: 1/1;
    height: 4.5em;
    border-radius: 16px;
    margin-left: auto;
    margin-right: auto;
`

export default InstallPeak

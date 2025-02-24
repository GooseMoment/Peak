import styled from "styled-components"

import Module, { Center, CenteredText, Title } from "@components/home/Module"

import { useTranslation } from "react-i18next"

const AllowNotification = () => {
    const { t } = useTranslation("home", { keyPrefix: "allow_notification" })

    if (window.Notification.permission !== "default") {
        return null
    }

    return (
        <Module to="/app/settings/notifications">
            <Title displayArrow underline>
                {t("title")}
            </Title>
            <Center>
                <MockNoti>
                    <AppIcon src="/logo.svg" draggable="false" />
                    <MockNotiTexts>
                        <MockNotiTitle>{t("noti_title")}</MockNotiTitle>
                        <MockNotiBody>{t("noti_body")}</MockNotiBody>
                    </MockNotiTexts>
                </MockNoti>
            </Center>
            <CenteredText>{t("description")}</CenteredText>
        </Module>
    )
}

const MockNoti = styled.div`
    position: relative;

    display: flex;
    gap: 0.75em;
    align-items: center;

    width: 100%;
    max-width: 400px;
    padding: 0.75em;
    background-color: ${(p) => p.theme.secondBackgroundColor};
    border-radius: 18px;
`

const AppIcon = styled.img`
    aspect-ratio: 1/1;
    height: 2.25em;
    border-radius: 7px;
`

const MockNotiTexts = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25em;
`

const MockNotiTitle = styled.h4`
    font-weight: 600;
    font-size: 0.85em;
`

const MockNotiBody = styled.p`
    font-size: 0.85em;
`

export default AllowNotification

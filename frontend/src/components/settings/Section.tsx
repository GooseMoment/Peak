import styled from "styled-components"

import Button from "@components/common/Button"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const Section = styled.section`
    margin-top: 2em;

    &::after {
        display: block;
        height: 0;
        content: " ";
        clear: both;
    }
`

export const Name = styled.h2`
    user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
`

export const Description = styled.span`
    user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;

    display: block;
    margin-top: 1em;
    font-weight: 400;
    font-size: 0.8em;
    line-height: 140%;
    color: grey;
`

export const Value = styled.div`
    margin-top: 1.5em;
`

export const ValueError = ({ onClickRetry }: { onClickRetry: () => void }) => {
    const { t } = useTranslation("settings", { keyPrefix: "error" })

    return (
        <ValueErrorContainer>
            <ValueErrorText>
                <FeatherIcon icon="alert-triangle" />
                {t("text")}
            </ValueErrorText>
            <Button onClick={onClickRetry}>{t("retry")}</Button>
        </ValueErrorContainer>
    )
}

const ValueErrorContainer = styled(Value)`
    border: 2px solid ${(p) => p.theme.primaryColors.warning};
    padding: 1em;
    border-radius: 16px;
    width: fit-content;
`

const ValueErrorText = styled.p`
    user-select: none;
    -webkit-user-select: none;
    margin-bottom: 1em;
`

export default Section

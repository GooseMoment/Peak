import styled from "styled-components"

import Button from "../common/Button"

import { useTranslation } from "react-i18next"

export default function ErrorBox({
    title,
    message,
    onRetry,
}: {
    title?: string
    message?: string
    onRetry?: () => void
}) {
    const { t } = useTranslation("translation")

    return (
        <Container>
            <ErrorTitle>
                {title || t("common.error_something_wrong")}
            </ErrorTitle>
            <ErrorMessage>
                {message || t("common.error_something_wrong_description")}
            </ErrorMessage>
            {onRetry && <Button onClick={onRetry}>{t("common.retry")}</Button>}
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
`

const ErrorTitle = styled.h2`
    color: ${(p) => p.theme.textColor};
    font-size: 1.5em;
    font-weight: 600;
`

const ErrorMessage = styled.div`
    color: ${(p) => p.theme.textColor};
    word-break: keep-all;
    line-height: 1.4;
`

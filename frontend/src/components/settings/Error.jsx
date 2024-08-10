import styled from "styled-components"

import { Meh } from "feather-icons-react"
import { useTranslation } from "react-i18next"

const Error = () => {
    const { t } = useTranslation("settings", { keyPrefix: "error" })

    return (
        <Container>
            <StyledMeh />
            <Message>{t("text")}</Message>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    display: flex;
    gap: 1.5em;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const StyledMeh = styled(Meh)`
    stroke: 2em;
    font-size: 3em;
    margin-right: 0 !important;
`

const Message = styled.p``

export default Error

import { Link, useLocation } from "react-router-dom"

import styled from "styled-components"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"

const PageBack = ({ defaultTo, children }) => {
    const location = useLocation()
    const { t } = useTranslation("", {
        keyPrefix: "common.header",
    })

    return (
        <BackLink to={location.state?.backTo || defaultTo}>
            <FeatherIcon icon="arrow-left-circle" />
            {children || t("back")}
        </BackLink>
    )
}

const BackLink = styled(Link)`
    display: block;
    color: ${(p) => p.theme.secondTextColor};
    margin-bottom: 1em;
    font-weight: 700;

    & svg {
        top: 0.15em;
        margin-right: 0.25em;
        stroke-width: 3px;
    }
`

export default PageBack

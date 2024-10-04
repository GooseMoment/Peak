import { Link, useLocation } from "react-router-dom"

import styled from "styled-components"

const PageBack = ({ defaultTo, children }) => {
    const location = useLocation()

    return (
        <BackLink to={location.state?.backTo || defaultTo}>
             {children || "돌아가기"}
        </BackLink>
    )
}

const BackLink = styled(Link)`
    display: block;
    color: ${(p) => p.theme.secondTextColor};
    margin-bottom: 1em;
    font-weight: 700;
`

export default PageBack

import { Link } from "react-router-dom"

import styled, { css, keyframes } from "styled-components"

import { skeletonCSS } from "@assets/skeleton"

const Module = styled.article`
    position: relative;
    margin-bottom: 2em;

    ${(p) =>
        p.$skeleton &&
        css`
            height: ${p.$height};
            ${skeletonCSS}
        `}
`

export const Title = ({ className, children, to, underline, loading }) => {
    if (loading) {
        return <StyledH2 className={className} $loading />
    }

    const title = (
        <StyledH2 className={className}>
            <TitleText $underline={underline}>{children}</TitleText>{" "}
            {to && "〉"}
        </StyledH2>
    )

    if (to) {
        return (
            <Link state={{ backTo: "/app/home" }} to={to}>
                {title}
            </Link>
        )
    }

    return title
}

const StyledH2 = styled.h2`
    font-weight: 600;
    font-size: 1em;
    margin-bottom: 0.75em;

    ${(p) =>
        p.$loading &&
        css`
            height: 1.25em;
            width: 15em;
            max-width: 100%;
            ${skeletonCSS}
        `}
`

const mark = keyframes`
    0% {
        background-size: 0% 0.25em;
    }
    100% {
        background-size: 100% 0.25em;
    }
`

const TitleText = styled.span`
    ${(p) =>
        p.$underline &&
        css`
            animation: ${mark} 0.5s var(--cubic) forwards;
            animation-delay: 0.5s;
            background: linear-gradient(#ffff00 0%, #ffff00 100%) bottom left/0%
                0.25em no-repeat;
        `}
`

export const CenteredText = styled.div`
    text-align: center;
    width: 100%;
    font-size: 0.75em;
`

export default Module

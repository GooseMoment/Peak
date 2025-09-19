import { type ReactNode } from "react"
import { Link } from "react-router-dom"

import styled, { css, keyframes } from "styled-components"

import { skeletonCSS } from "@assets/skeleton"

interface ModuleProp {
    className?: string
    children: ReactNode
    to?: string
}

const Module = ({ children, className, to }: ModuleProp) => {
    const module = <ModuleBox className={className}>{children}</ModuleBox>

    if (to === undefined) {
        return module
    }

    return <Link to={to}>{module}</Link>
}

const ModuleBox = styled.article`
    position: relative;
    margin-bottom: 2em;
`

interface TitleProp {
    className?: string
    children?: ReactNode
    to?: string
    displayArrow?: boolean
    underline?: boolean
    loading?: boolean
}

export const Title = ({
    className,
    children,
    to,
    displayArrow = false,
    underline,
    loading = false,
}: TitleProp) => {
    if (loading) {
        return <StyledH2 className={className} $loading />
    }

    const title = (
        <StyledH2 className={className}>
            <TitleText $underline={underline}>{children}</TitleText>{" "}
            {(to || displayArrow) && "〉"}
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

const StyledH2 = styled.h2<{ $loading?: boolean }>`
    font-weight: 600;
    font-size: 1em;
    margin-bottom: 0.75em;

    ${(p) =>
        p.$loading &&
        css`
            height: 1.25em;
            width: 15em;
            max-width: 100%;
            ${skeletonCSS()}
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

const TitleText = styled.span<{ $underline?: boolean }>`
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
    word-break: keep-all;
`

export const Center = styled.div`
    display: flex;
    justify-content: center;

    width: 100%;

    margin: 1em 0;
`

export default Module

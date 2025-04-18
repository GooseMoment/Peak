import type { ReactNode } from "react"

import styled from "styled-components"

import { ifMobile } from "@utils/useScreenType"

import RoadSign from "@assets/errors/RoadSign"

export interface ErrorProp {
    code: string
    text?: string
    error?: Error
    height?: string
    children?: ReactNode
}

const ErrorLayout = ({
    code,
    text,
    error,
    children,
    height = "100dvh",
}: ErrorProp) => {
    return (
        <Container $height={height}>
            <Main>
                <RoadSign text={code} />
                <Text>{text}</Text>
            </Main>
            <ChildrenWrapper>{children}</ChildrenWrapper>
            {error && (
                <ErrorMessage>
                    <ErrorType>{error.name} </ErrorType>
                    {error.message}
                </ErrorMessage>
            )}
        </Container>
    )
}

const Container = styled.div<{ $height: string }>`
    width: 100%;
    height: ${(p) => p.$height};
    padding: 5em 0;
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5em;

    color: ${(p) => p.theme.textColor};
`

const Main = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2.5em;
`

const Text = styled.h1`
    font-size: 1em;
    font-weight: bold;
`

const ErrorMessage = styled.div`
    overflow-x: auto;
    padding: 0.75em;
    background-color: ${(p) => p.theme.thirdBackgroundColor};
    max-width: 500px;
    line-height: 1.2;

    ${ifMobile} {
        max-width: 300px;
    }
`

const ErrorType = styled.span`
    font-weight: 600;
`

const ChildrenWrapper = styled.div`
    font-size: 1em;
`

export default ErrorLayout

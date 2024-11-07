import styled, { css } from "styled-components"

export const CreateSimpleBox = ({ icon, children }) => {
    return (
        <Box>
            {icon}
            <VLine />
            <ContentBlock>{children}</ContentBlock>
        </Box>
    )
}

const Box = styled.div`
    display: flex;
    align-items: center;

    & svg {
        top: 0;
        width: 22px;
        height: 22px;
        margin-right: 1em;
        flex-shrink: 0;
        stroke: ${(p) => p.theme.textColor};
    }
`

const VLine = styled.div`
    border-left: thin solid ${(p) => p.theme.grey};
    height: 1.3em;
    margin-right: 1em;
`

const ContentBlock = styled.div`
    display: flex;
    gap: 0.5em;
`

export const ContentBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: 1em;
    padding: 0.5em 0.7em;
    border: solid 1.5px ${(p) => p.theme.grey};
    border-radius: 15px;
    font-weight: 450;
    outline: none;
    white-space: nowrap;

    & svg {
        margin-right: 0.3em;
    }

    ${(props) =>
        props.$isActive &&
        css`
            color: ${(p) => p.theme.white};
            background-color: ${(props) => props.$color};

            & svg {
                stroke: ${(p) => p.theme.white};
            }
        `}
`

import styled, { css } from "styled-components"

export const CreateSimpleBox = ({ onKeyDown, icon, children }) => {
    return (
        <Box onKeyDown={onKeyDown}>
            {icon}
            <VLine />
            <FlexBox>
                {children}
            </FlexBox>
        </Box>
    )
}


const Box = styled.div`
    display: flex;
    align-items: center;

    & svg, img {
        top: 0;
        width: 1.3em;
        height: 1.3em;
        margin-right: 1em;
        stroke: ${p=>p.theme.textColor};
    }

    & img {
        filter: ${p=>p.theme.project.imgColor};
    }
`

const VLine = styled.div`
    border-left: thin solid ${p=>p.theme.grey};
    height: 1.3em;
    margin-right: 1em;
`

const FlexBox = styled.div`
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

    ${props=>props.$isActive && css`
        color: ${p=>p.theme.white};
        background-color: ${p=>p.theme.goose};
    `}

    & svg {
        margin-right: 0.3em;
    }
`

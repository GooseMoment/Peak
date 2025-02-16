import styled, { css } from "styled-components"

const Input = (props) => {
    const icon = props.icon
    const inputProps = (({ icon: _, ...others }) => ({ ...others }))(props) // remove key "icon" from props and clone

    return (
        <Box>
            <StyledInput $hasIcon={icon ? true : false} {...inputProps} />
            {icon ? <IconBox>{icon}</IconBox> : null}
        </Box>
    )
}

const Box = styled.p`
    position: relative;
    font-size: 1rem;

    box-sizing: border-box;
    clear: both;
`

const StyledInput = styled.input`
    width: ${(p) => p.$width || "100%"};
    padding: 0.75em 1.25em;
    border: 1px solid ${(p) => p.theme.textColor};
    border-radius: 16px;

    box-sizing: border-box;

    font-size: inherit;

    ${(props) =>
        props.$hasIcon
            ? css`
                  padding-left: 2.5em;
              `
            : null}

    &:focus {
        border-color: ${(p) => p.theme.accentColor};
    }
`

const IconBox = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;

    position: absolute;
    top: 0;
    left: 1em;
    height: 100%;

    & svg,
    & img {
        top: 0;
        height: 1em;
    }
`

export default Input

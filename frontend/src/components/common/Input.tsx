import type { InputHTMLAttributes } from "react"

import styled, { css } from "styled-components"

import FeatherIcon, { type FeatherIconName } from "feather-icons-react"

interface StyledInputProp {
    $width?: string
    $hasIcon: boolean
}

interface InputProp
    extends InputHTMLAttributes<HTMLInputElement>,
        Omit<StyledInputProp, "$hasIcon"> {
    icon?: FeatherIconName
}

const Input = ({ icon, ...others }: InputProp) => {
    return (
        <Box>
            {icon && (
                <IconBox>
                    <FeatherIcon icon={icon} />
                </IconBox>
            )}
            <StyledInput $hasIcon={!!icon} {...others} />
        </Box>
    )
}

const Box = styled.p`
    position: relative;
    font-size: 1rem;

    box-sizing: border-box;
    clear: both;
`

const StyledInput = styled.input<StyledInputProp>`
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

    transition: border-color 0.25s var(--cubic);

    &:focus {
        border-color: ${(p) => p.theme.accentColor};
    }

    &:autofill,
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
        caret-color: ${(p) => p.theme.textColor};
        -webkit-text-fill-color: ${(p) => p.theme.textColor};
        box-shadow: inset 0 0 0 32px ${(p) => p.theme.backgroundColor};
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

    & svg {
        top: 0;
        height: 1em;
    }
`

export default Input

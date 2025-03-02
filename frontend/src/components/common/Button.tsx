import type { ButtonHTMLAttributes, ElementType, ReactNode } from "react"

import styled from "styled-components"

import LoaderCircle from "@components/common/LoaderCircle"

import MildButton from "./MildButton"

import { cubicBeizer } from "@assets/keyframes"
import type { State } from "@assets/themes"

type ButtonForm = "filled" | "outlined"

export interface ButtonProp extends ButtonHTMLAttributes<HTMLButtonElement> {
    form?: ButtonForm
    state?: State
    loading?: boolean
    children?: ReactNode
}

export default function Button({
    form = "outlined",
    state = "text",
    loading = false,
    children,
    ...htmlProps
}: ButtonProp) {
    const SelectedButton = buttons[form]

    return (
        <SelectedButton {...htmlProps} $state={state}>
            {loading && <ButtonLoader />} {children}
        </SelectedButton>
    )
}

export const ButtonGroup = styled.div<{
    $justifyContent: string
    $margin: string
}>`
    display: flex;
    gap: 1em;
    justify-content: ${(p) => p.$justifyContent || "center"};
    margin: ${(p) => p.$margin || "none"};
`

const CommonButton = styled(MildButton)`
    border: 1.5px solid transparent;
    border-radius: 10px;
    font-weight: 600;
    line-height: 20px;
    padding: 0.5em 1em;
    position: relative;
    text-decoration: none;
    touch-action: manipulation;
    user-select: none;
    -webkit-user-select: none;
    width: auto;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    &:focus-visible {
        box-shadow:
            #222222 0 0 0 2px,
            rgba(255, 255, 255, 0.8) 0 0 0 4px;
        transition: box-shadow 0.2s;
    }

    &:active:hover:enabled {
        filter: brightness(0.9);
        transform: scale(0.9);
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }

    transition:
        box-shadow 0.2s,
        -ms-transform 0.1s,
        -webkit-transform 0.1s,
        transform 0.1s,
        background-color 0.5s ${cubicBeizer},
        border-color 0.5s ${cubicBeizer},
        color 0.5s ${cubicBeizer};
`

interface StyledButtonProp {
    $state: State
}

const FilledButton = styled(CommonButton)<StyledButtonProp>`
    background-color: ${(p) => p.theme.primaryColors[p.$state]};
    border-color: ${(p) => p.theme.backgroundColor};
    color: ${(p) => p.theme.backgroundColor};
`

const OutlinedButton = styled(CommonButton)<StyledButtonProp>`
    background-color: ${(p) => p.theme.backgroundColor};
    border-color: ${(p) => p.theme.primaryColors[p.$state]};
    color: ${(p) => p.theme.primaryColors[p.$state]};
`

const buttons: Record<
    ButtonForm,
    ElementType<StyledButtonProp | ButtonHTMLAttributes<HTMLButtonElement>>
> = { filled: FilledButton, outlined: OutlinedButton }

const ButtonLoader = styled(LoaderCircle)`
    margin-right: 0.25em;
    opacity: 0.9;
    border-color: inherit;
    border-left-color: transparent;
`

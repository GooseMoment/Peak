import MildButton from "./MildButton"
import { states } from "@assets/themes"

import styled from "styled-components"

export const buttonForms = {
    FILLED: "filled",
    OUTLINED: "outlined",
}

const Button = (props) => {
    const { $form=buttonForms.OUTLINED, $state=states.TEXT } = props
    const SelectedButton = buttons[$form]

    return <SelectedButton {...props} $state={$state}>{props.children}</SelectedButton>
}

const CommonButton = styled(MildButton)`
    border: 1.5px solid transparent;
    border-radius: 10px;
    font-weight: 600;
    line-height: 20px;
    padding: 0.5em 1em;
    position: relative;
    text-decoration: none;
    touch-action: manipulation;
    transition: box-shadow .2s,-ms-transform .1s,-webkit-transform .1s,transform .1s;
    user-select: none;
    -webkit-user-select: none;
    width: auto;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    
    &:focus-visible {
        box-shadow: #222222 0 0 0 2px, rgba(255, 255, 255, 0.8) 0 0 0 4px;
        transition: box-shadow .2s;
    }

    &:active:hover:enabled {
        background-color: #F7F7F7;
        transform: scale(.9);
    }

    &:disabled {
        border-color: #DDDDDD;
        color: #DDDDDD;
        cursor: not-allowed;
        opacity: 1;
    }
`

const FilledButton = styled(CommonButton)`
    background-color: ${p => p.theme.primaryColors[p.$state]};
    border-color: ${p => p.theme.primaryColors[p.$state]};
    color: ${p => p.theme.primaryColors[p.$state]};
    mix-blend-mode: difference;
`

const OutlinedButton = styled(CommonButton)`
    background-color: ${p => p.theme.white};
    border-color: ${p => p.theme.primaryColors[p.$state]};
    color: ${p => p.theme.primaryColors[p.$state]};
`

const buttons = {
    filled: FilledButton,
    outlined: OutlinedButton,
}

export default Button
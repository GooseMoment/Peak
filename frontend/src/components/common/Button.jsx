import MildButton from "./MildButton"
import { states } from "@assets/themes"

import styled from "styled-components"

export const buttonForms = {
    filled: "filled",
    outlined: "outlined",
}

/**
 * 공용 버튼 컴포넌트
 * @param {Object} props - button의 모든 props 
 * @param {?string} $form - buttonForms 목록 중 사용 (기본: outlined)
 * @param {?string} $state - assets/themes/states 목록 중 사용 (기본: states.TEXT)
 */
const Button = (props) => {
    const { $form=buttonForms.outlined, $state=states.text } = props
    const SelectedButton = buttons[$form]

    return <SelectedButton {...props} $state={$state}>{props.children}</SelectedButton>
}

export const ButtonGroup = styled.div`
    display: flex;
    gap: 1em;
    justify-content: ${p => p.$justifyContent || "center"};
    margin: ${p => p.$margin || "none"};
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
        filter: brightness(.9);
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
    color: ${p => p.theme.backgroundColor};
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
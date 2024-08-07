import styled from "styled-components"

/**
 * input type="checkbox"를 스타일링하는 토글 스위치
 * @param {Object} props - input type="checkbox"의 모든 props를 수용합니다.
 * @param {boolean} checked
 * @param {Function} onChange
 */
const Switch = (props) => {
    const onClick = props?.onClick

    return (
        <Label onClick={onClick}>
            <Checkbox {...props} type="checkbox" />
            <Slider />
        </Label>
    )
}

// design from https://uiverse.io/namecho/quiet-panther-93

const Label = styled.label`
    --button-width: 3.5em;
    --button-height: 2em;
    --toggle-diameter: 1.5em;
    --button-toggle-offset: calc(
        (var(--button-height) - var(--toggle-diameter)) / 2
    );
    --toggle-shadow-offset: 10px;
    --toggle-wider: 3em;
    --color-grey: ${(p) => p.theme.grey};
    --color-green: ${(p) => p.theme.accentColor};
`

const Checkbox = styled.input`
    display: none;
`

const Slider = styled.span`
    display: inline-block;
    width: var(--button-width);
    height: var(--button-height);
    background-color: var(--color-grey);
    border-radius: calc(var(--button-height) / 2);
    position: relative;
    transition: 0.3s all ease-in-out;

    &::after {
        content: "";
        display: inline-block;
        width: var(--toggle-diameter);
        height: var(--toggle-diameter);
        background-color: ${(p) => p.theme.secondBackgroundColor};
        border-radius: calc(var(--toggle-diameter) / 2);
        position: absolute;
        top: var(--button-toggle-offset);
        transform: translateX(var(--button-toggle-offset));
        box-shadow: var(--toggle-shadow-offset) 0
            calc(var(--toggle-shadow-offset) * 4) rgba(0, 0, 0, 0.1);
        transition: 0.3s all ease-in-out;
    }

    ${Checkbox}:checked + & {
        background-color: var(--color-green);

        &::after {
            transform: translateX(
                calc(
                    var(--button-width) - var(--toggle-diameter) - var(
                            --button-toggle-offset
                        )
                )
            );
            box-shadow: calc(var(--toggle-shadow-offset) * -1) 0
                calc(var(--toggle-shadow-offset) * 4) rgba(0, 0, 0, 0.1);
        }
    }

    ${Checkbox}:active + &::after {
        width: var(--toggle-wider);
    }

    ${Checkbox}:checked:active + &::after {
        transform: translateX(
            calc(
                var(--button-width) - var(--toggle-wider) - var(
                        --button-toggle-offset
                    )
            )
        );
    }
`

export default Switch

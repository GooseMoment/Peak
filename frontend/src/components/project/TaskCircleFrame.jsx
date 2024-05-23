import FeatherIcon from "feather-icons-react"
import styled, { keyframes, css } from "styled-components"

const TaskCircleFrame = ({completed=false, color='FF4A03', isDate=null, editable=false, isLoading=false, toComplete=() => {}}) => {
    return (
        <TaskCircle 
            $completed={completed}
            $color={color}
            $isDate={isDate}
            $editable={editable}
            $isLoading={isLoading}
            onClick={toComplete}
        >
            {completed && <FeatherIcon icon="check"/>}
        </TaskCircle>
    )
}

const TaskCircle = styled.div`
    display: flex;
    justify-content: center;
    top: ${(props) => (props.$editable ? 0.1 : props.$isDate ? 0.3 : 0)}em;
    height: 1.2em;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 3px solid ${(props) => (props.$completed ? '#A4A4A4': `#${props.$color}`)};
    position: relative;
    margin-right: 0.6em;
    font-size: 1em;

    & svg {
        width: 1em;
        height: 1em;
        stroke: #A4A4A4;
        stroke-width: 0.2em;
        margin-right: 0;
        animation: none;
    }

    ${({$isLoading}) => $isLoading ? css`
        border: 3px dashed ${(props) => (props.$completed ? '#A4A4A4': `#${props.$color}`)};
        animation: ${rotateAnimation} 6s linear infinite;

        & svg {
            animation: ${reverseRotateAnimation} 6s linear infinite;
        }
    `: null}
`

const rotateAnimation = keyframes`
    100% {
        transform: rotate(360deg);
    }
`;

const reverseRotateAnimation = keyframes`
    100% {
        transform: rotate(-360deg);
    }
`

export default TaskCircleFrame
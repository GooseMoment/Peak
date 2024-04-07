import { Link, useSubmit, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

import styled, {keyframes, css} from "styled-components"
import FeatherIcon from "feather-icons-react"

import notify from "@utils/notify"

function TaskName({projectId, task, color, editable}){
    const date = new Date()
    const submit = useSubmit()
    const navigate = useNavigate()
    const pathRoot = `/app/projects/${projectId}/tasks/${task.id}/detail`

    const [taskName, setTaskName] = useState(task.name)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(false)
    }, [task]);
    
    const onchange = (e) => {
        setTaskName(e.target.value)
    }
    
    const changeTaskName = async (name) => {
        submit({name}, {method: "PATCH"})
    }

    const onEnter = async (e) => {
        if(e.key === 'Enter') {
            changeTaskName(taskName)
            notify.success("이름이 변경되었습니다.")
        }
    }

    const toComplete = () => {
        setIsLoading(true)
        let completed_at = "null"
        if (!(task.completed_at)) {
            completed_at = date.toISOString()
        }
        submit({id: task.id, completed_at}, {
            method: "PATCH",
            action: `/app/projects/${projectId}`,
            navigate: false,
        })
    }

    const EditView = (
        <InputText 
            $completed={task.completed_at ? true : false}
            type='text'
            onChange={onchange}
            value={taskName}
            onKeyDown={onEnter}
            placeholder="할 일의 이름을 입력해주세요."
        />
    )

    const TextView = (
        <Text $completed={task.completed_at ? true : false}>
            {task.name}
        </Text>
    )

    return (
        <>
            <TaskNameBox>
                <TaskCircle 
                    $completed={task.completed_at ? true : false}
                    $color={color}
                    $due_date={task.due_date}
                    $editable={editable}
                    $isLoading={isLoading}
                    onClick={toComplete}
                >
                    {task.completed_at && <FeatherIcon icon="check"/>}
                </TaskCircle>
                { editable ? EditView :
                <Link to={pathRoot} style={{ textDecoration: 'none' }}> 
                    {TextView}
                </Link>}
            </TaskNameBox>
        </>
    );
}

const TaskNameBox = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    padding-top: 0.8em;

    &:hover {
        cursor: pointer;
    }
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
`;

const TaskCircle = styled.div`
    display: flex;
    justify-content: center;
    top: ${(props) => (props.$editable ? 0.1 : props.$due_date ? 0.3 : 0)}em;
    width: 1.2em;
    height: 1.2em;
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

const Text = styled.div`
    width: 60em;
    font-style: normal;
    font-size: 1.1em;
    color: ${(props) => (props.$completed ? '#A4A4A4' : '#000000')};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const InputText = styled.input`
    width: 36em;
    font-weight: normal;
    font-size: 1.1em;
    color: ${(props) => (props.$completed ? '#A4A4A4' : '#000000')};
    border: none;
    margin-top: 0.1em;

    &:focus {
        outline: none;
    }
`

export default TaskName
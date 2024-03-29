import styled from "styled-components"
import FeatherIcon from "feather-icons-react"

function TaskName({task, setTasks, color, due_date, openModal}){
    const date = new Date()

    return (
        <>
            <TaskNameBox>
                <TaskCircle 
                    $completed={task.completed_at ? true : false}
                    $color={color}
                    $due_date={due_date}
                >
                    {task.completed && <FeatherIcon icon="check"/>}
                </TaskCircle>
                <Text $completed={task.completed_at ? true : false} onClick={openModal}>
                    {task.name}
                </Text>
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

const TaskCircle = styled.div`
    top: ${(props) => (props.$due_date ? 0.3 : 0)}em;
    width: 1.2em;
    height: 1.2em;
    border-radius: 50%;
    border: 3px solid ${(props) => (props.$completed ? '#A4A4A4': `#${props.$color}`)};
    position: relative;
    margin-right: 0.6em;
    font-size: 1em;

    & svg {
    width: inherit;
    height: inherit;
    stroke: #A4A4A4;
}
`

const Text = styled.div`
    font-style: normal;
    font-size: 1em;
    color: ${(props) => (props.$completed ? '#A4A4A4' : '#000000')};
`

export default TaskName
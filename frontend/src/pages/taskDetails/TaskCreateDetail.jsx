import styled from "styled-components";
import FeatherIcon from 'feather-icons-react';

import TaskName from "@components/project/TaskName";
import Contents from "./Contents";
import { cubicBeizer } from "@assets/keyframes";

function TaskCreateDetail({projectId, task, color, setTasks, isModalOpen, onClose}) {
    return (
        <TaskCreateDetailBox>
            <TaskNameBox>
                <TaskName task={task} color={color} isModalOpen={isModalOpen}/>
                <Icons>
                    <FeatherIcon icon="trash-2" />
                    <FeatherIcon icon="x" onClick={onClose} />
                </Icons>
            </TaskNameBox>
            <Contents projectId={projectId} task={task} setTasks={setTasks}/>
        </TaskCreateDetailBox>
    )
}

const TaskCreateDetailBox = styled.div`
    width: 50em;
    height: 20em;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;

    transition: left 0.5s ${cubicBeizer}, width 0.5s ${cubicBeizer};
`

const TaskNameBox = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1em 1.8em;
`

const Icons = styled.div`
    display: flex;
    align-items: center;

    & svg {
        cursor: pointer;
        stroke: #FF0000;
        margin-left: 1em;
    }
`

export default TaskCreateDetail
import { useNavigate, useOutletContext, useRouteLoaderData } from "react-router-dom"

import styled from "styled-components"
import FeatherIcon from 'feather-icons-react'

import TaskName from "@components/project/TaskName"
import Contents from "./Contents"

function TaskCreateDetail({ setIsComponentOpen }) {
    const [projectId, color] = useOutletContext()
    const task = useRouteLoaderData("task")
    const navigate = useNavigate()

    const onClose = () => {
        navigate(`/app/projects/${projectId}`)
    }

    return (
        <TaskCreateDetailBox>
            <TaskNameBox>
                <TaskName projectId={projectId} task={task} color={color} editable={true}/>
                <Icons>
                    <FeatherIcon icon="trash-2" />
                    <FeatherIcon icon="x" onClick={onClose} />
                </Icons>
            </TaskNameBox>
            <Contents task={task} setIsComponentOpen={setIsComponentOpen}/>
        </TaskCreateDetailBox>
    )
}

const TaskCreateDetailBox = styled.div`
    width: 50em;
    height: 20em;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;
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
        top: 0.4em;
        cursor: pointer;
        stroke: #FF0000;
        margin-left: 1em;
    }
`

export default TaskCreateDetail
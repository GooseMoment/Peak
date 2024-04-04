import { useState } from "react"
import { useNavigate } from "react-router-dom"

import styled from "styled-components"

import TaskCreateDetail from "@/pages/taskDetails/TaskCreateDetail"
import ModalPortal from "@components/common/ModalPortal"
import TaskName from "./TaskName"

import Priority from "./Priority"

function Task({projectId, task, setTasks, color}){
    const today = new Date()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const navigate = useNavigate()
    
    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        navigate(`/app/projects/${projectId}`)
        setIsModalOpen(false)
    }

    return (
        <Box>
            <Priority priority={task.priority}/>
            <div>
                <TaskName projectId={projectId} task={task} setTasks={setTasks} color={color} due_date={task.due_date} isModalOpen={isModalOpen} openModal={openModal}/>
                {task.due_date && <CalendarText>
                        {task.due_date === today.toISOString().slice(0, 10) && <CalendarTextPlus>오늘</CalendarTextPlus>}
                        {task.due_date === today.toISOString().slice(0, 10) && "| "}
                        {task.due_date}
                </CalendarText>}
            </div>
            {isModalOpen &&
            <ModalPortal closeModal={closeModal}>
                <TaskCreateDetail projectId={projectId} task={task} color={color} setTasks={setTasks} isModalOpen={isModalOpen} onClose={closeModal} />
            </ModalPortal>}
        </Box>
    );
}

const Box = styled.div`
    display: flex;
    align-items: center;
    margin-top: 1em;
    margin-bottom: 2em;

    & img {
        width: 1em;
        height: 1em;
        margin-top: 0.4em;
        margin-right: 0.2em;
    }
`

const CalendarText = styled.p`
    display: flex;
    margin-left: 2.8em;
    font-style: normal;
    font-size: 0.8em;
    color: #000;
`

const CalendarTextPlus = styled.p`
    font-style: bold;
    font-size: 1em;
    color: #FF0000;
    padding-right: 0.5em;
`

export default Task
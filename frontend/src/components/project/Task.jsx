import styled from "styled-components";
import { useState } from "react";

import TaskCreateDetail from "@components/project/TaskCreateDetail";
import TaskName from "./TaskName";
import ModalPortal from "./ModalPortal";

function Task({task}){
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <TaskName task={task} onClick={() => setIsModalOpen(true)} />
            {task.due_date && <CalendarText>    
                    {task.due_date === "02월 20일" && <CalendarTextPlus>오늘</CalendarTextPlus>}
                    {task.due_date === "02월 20일" && "| "}
                    {task.due_date}
            </CalendarText>}
            { isModalOpen &&
            <ModalPortal>
                <TaskCreateDetail task={task} onClose={() => setIsModalOpen(false)} />,
                document.body
            </ModalPortal>}
        </>
    );
}

const CalendarText = styled.h3`
    display: flex;
    margin-left: 3.6em;
    font-style: normal;
    font-size: 0.6em;
    color: #000;
`

const CalendarTextPlus = styled.h3`
    font-style: bold;
    font-size: 0.6em;
    color: #FF0000;
    padding-right: 0.5em;
`

export default Task
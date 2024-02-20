import { useState } from "react";
import styled from "styled-components";
import FeatherIcon from 'feather-icons-react';

import TaskCreateDetail from "@/components/project/TaskCreateDetail";

const TaskNameBox = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    padding-top: 0.6em;

    &:hover {
        text-decoration: underline;
        cursor: pointer;
    }
`

const TaskCircle = styled.div`
    width: 1.2em;
    height: 1.2em;
    border-radius: 50%;
    border: 3px solid ${(props) => (props.$done ? '#A4A4A4':'#2E61DC')};
    position: relative;
    margin-right: 0.6em;
    font-size: 1em;

    & .feather {
    width: inherit;
    height: inherit;
    stroke: #A4A4A4;
}
`

const Text = styled.div`
    font-style: normal;
    font-size: 1em;
    color: ${(props) => (props.$done ? '#A4A4A4' : '#000000')};
`

const today = new Date();

const formattedDate = `${today.getMonth() + 1}월 ${today.getDate() + 1}일`

const CalendarText = styled.h3`
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

const ModalBackdrop = styled.div`
    z-index: 1;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,0.4);
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
`

function TaskName({text, done, day}){
    const [isModalOpen, setIsModalOpen] = useState(false);

    const ModalHandler = () => {
        setIsModalOpen(!isModalOpen);
    }

    return (
        <>
            <TaskNameBox onClick={ModalHandler}>
                <TaskCircle $done={done}>{done && <FeatherIcon icon="check"/>}</TaskCircle>
                <Text $done={done}>{text}</Text>
            </TaskNameBox>
            <CalendarText>
                    {day === formattedDate && <CalendarTextPlus>오늘</CalendarTextPlus>}
                    {day === formattedDate && "| "}
                    {day}
            </CalendarText>
            {isModalOpen ?
                <ModalBackdrop onClick={ModalHandler}>
                    <TaskCreateDetail onClick={(e) => e.stopPropagaion()}/>
                </ModalBackdrop>
                : null
            }
        </>
    );
}

export default TaskName
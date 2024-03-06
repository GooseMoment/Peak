import styled from "styled-components";
import FeatherIcon from 'feather-icons-react';
import { useEffect } from "react";

import TaskName from "../TaskName";
import Contents from "./Contents";

function TaskCreateDetail({task, onClose}) {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.querySelector('html').scrollTop = window.scrollY;
            return () => document.body.style.overflow = null;
        }, []);

    return (
        <TaskCreateDetailBox>
            <TaskNameBox>
                <TaskName task={task} />
                <Icons>
                    <FeatherIcon icon="trash-2" />
                    <FeatherIcon icon="x" onClick={onClose} />
                </Icons>
            </TaskNameBox>
            <Contents />
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
        cursor: pointer;
        stroke: #FF0000;
        margin-left: 1em;
    }
`

export default TaskCreateDetail
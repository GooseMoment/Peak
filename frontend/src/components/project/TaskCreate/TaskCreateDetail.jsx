import styled from "styled-components";
import FeatherIcon from 'feather-icons-react';
import { useEffect } from "react";

import TaskName from "../TaskName";
import Detail from "./Detail";
import ModalPortal from "../ModalPortal";

function TaskCreateDetail({task, onClose}) {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.querySelector('html').scrollTop = window.scrollY;
            return () => document.body.style.overflow = null;
        }, []);

    return (
        <ModalBackdrop>
            <ModalPortal>
                <TaskCreateDetailBox>
                    <TaskNameBox>
                        <TaskName task={task} />
                        <Icons>
                            <FeatherIcon icon="trash-2" />
                            <FeatherIcon icon="x" onClick={onClose} />
                        </Icons>
                    </TaskNameBox>
                    <Detail />
                </TaskCreateDetailBox>
            </ModalPortal>
        </ModalBackdrop>
    )
}

const TaskCreateDetailBox = styled.div`
    z-index: 4;
    width: 50em;
    height: 20em;
    background-color: #FFFFFF;
    border: solid 1px #D9D9D9;
    border-radius: 15px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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

const ModalBackdrop = styled.div`
    z-index: 3;
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

export default TaskCreateDetail
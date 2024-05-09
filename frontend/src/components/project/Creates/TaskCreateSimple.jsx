import { useSubmit } from "react-router-dom"
import { useState } from "react"

import FeatherIcon from "feather-icons-react"
import styled, { css } from "styled-components"

import notify from "@utils/notify"
import hourglass from "@assets/project/hourglass.svg"
import alarmclock from "@assets/project/alarmclock.svg"
import TaskNameInput from "@/components/project/TaskNameInput"
import SimplePriority from "./simple/SimplePriority"

const TaskCreateSimple = ({color}) => {
    const submit = useSubmit()

    const [tab, setTab] = useState(0)
    const [newTaskName, setNewTaskName] = useState('')

    const items = [
        {id: 0, icon: <FeatherIcon icon="tag" />, display: 
            <TaskNameInput 
                newTaskName={newTaskName}
                setNewTaskName={setNewTaskName}
                color={color}
            />
        },
        {id: 1, icon: <FeatherIcon icon="calendar" />, display: "2024년 02월 20일 18:00"},
        {id: 2, icon: <img src={hourglass} />, display: "2024년 02월 20일 16:00"},
        {id: 3, icon: <img src={alarmclock} />, display: "여러개 들어가야함.."},
        {id: 4, icon: <FeatherIcon icon="alert-circle" />, display: <SimplePriority/>}, 
        {id: 4, icon: <FeatherIcon icon="archive" />, display: "홍대라이프 / 수강신청"},
        {id: 5, icon: <FeatherIcon icon="edit" />, display: "없음"},
    ]


    return (
        <>
            <Box>
                <FlexBox>
                    {items.map((val, index) => {
                        return (
                            <IndexBox
                            $active={tab === index}
                            key={val.id}
                            onClick={setTab(index)}
                            >
                                {val.icon}
                            </IndexBox>
                    )})}
                </FlexBox>
            </Box>
            <MainBox>
                <MainDetailBox>
                    {items[tab].display}
                </MainDetailBox>
            </MainBox>
        </>
    )
}

const Box = styled.div`
    display: flex;
    align-items: center;
`

const FlexBox = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-left: 1em;
    margin-top: 1em;
`

const IndexBox = styled.div`
    z-index: 1;
    position: relative;
    width: 2.3em;
    height: 2em;
    background-color: #FFFFFF;
    border: solid 2px #D9D9D9;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    cursor: pointer;
    text-align: center;
    margin-left: 5px;
    border-bottom: none;
    
    ${(props) =>
        props.$active && css`
            background-color: #FF4A03;
            border: solid 2px #FFD7D7;
            border-bottom: none;

            & svg {
                stroke: #FFFFFF;
            }
            & img {
                filter: invert(99%) sepia(5%) saturate(385%) hue-rotate(252deg) brightness(118%) contrast(100%);
            }
        `
    }

    & svg {
        width: 1.1em;
        height: 1.1em;
        margin-top: 6px;
        margin-left: 8px;
    }

    & img {
        width: 1.1em;
        height: 1.1em;
        margin-top: 8px;
    }
`

const MainBox = styled.div`
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3.8em;
    background-color: #FFFFFF;
    border: solid 2px #D9D9D9;
    border-radius: 20px;
    margin-bottom: none;
`

const MainDetailBox = styled.div`
    display: flex;
    margin-left: 1.5em;
`

export default TaskCreateSimple
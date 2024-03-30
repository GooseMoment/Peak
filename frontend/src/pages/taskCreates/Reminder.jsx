import { useEffect, useState } from "react"

import styled from "styled-components"

import DetailFrame from "@components/project/common/DetailFrame"
import { patchTask } from "@api/tasks.api"

import before_5 from "@/assets/project/reminder/before_5.svg"
import before_15 from "@/assets/project/reminder/before_15.svg"
import before_30 from "@/assets/project/reminder/before_30.svg"
import before_1h from "@/assets/project/reminder/before_1h.svg"
import before_D from "@/assets/project/reminder/before_D.svg"
import before_1D from "@/assets/project/reminder/before_1D.svg"
import before_2D from "@/assets/project/reminder/before_2D.svg"
import custom from "@/assets/project/reminder/custom.svg"

const Reminder = ({ task, setTasks, onClose }) => {
    let DueDateTime = new Date(`${task.due_date}T${task.due_time}`)

    const changeReminder = (id, item_id, set, day, hour, minute) => {
        return async () => {
            { task.due_date && DueDateTime.setDate(DueDateTime.getDate() - day)}
            { task.due_time && DueDateTime.setHours(DueDateTime.getHours() - hour)}
            { task.due_time && DueDateTime.setMinutes(DueDateTime.getMinutes() - minute)}
            { set && DueDateTime.setHours(9)}
            { set && DueDateTime.setMinutes(0)}

            const edit = {
                'reminder_datetime': DueDateTime,
            }
            await patchTask(id, edit)
            setTasks(prev => prev.map((prevTask) => {
                if (prevTask.id === task.id) {
                    prevTask.reminder_datetime = DueDateTime
                    return prevTask
                }
                return prevTask
            }))
        }
    }

    return (
        <DetailFrame title="알람 설정" onClose={onClose}>
            {items.map(item => (
                <ItemBlock key={item.id}>
                    {item.icon}
                    <ItemText onClick={changeReminder(task.id, item.id, item.set, item.day, item.hour, item.minute)}>
                        {item.content}
                    </ItemText>
                </ItemBlock>
            ))}
        </DetailFrame>
    )
}

const ItemBlock = styled.div`
    display: flex;
    gap: 0.5em;
    align-items: center;
    margin-left: 1.2em;
    margin-top: 1.2em;

    & svg {
        stroke: #FF4A03;
        top: 1.2em;
    }
`

const ItemText = styled.p`
    font-weight: normal;
    font-size: 1em;
    color: #000000;

    &:hover {
        font-weight: bolder;
        color: #FF4A03;
        cursor: pointer;
    }
`

const items = [
    {id: 0, icon: <img src={before_5}/>, content: "5분 전", set: false, day: 0, hour: 0, minute: 5},
    {id: 1, icon: <img src={before_15}/>, content: "15분 전", set: false, day: 0, hour: 0, minute: 15},
    {id: 2, icon: <img src={before_30}/>, content: "30분 전", set: false, day: 0, hour: 0, minute: 30},
    {id: 3, icon: <img src={before_1h}/>, content: "1시간 전", set: false, day: 0, hour: 1, minute: 0},
    {id: 4, icon: <img src={before_D}/>, content: "당일", set: true, day: 0, hour: 0, minute: 0},
    {id: 5, icon: <img src={before_1D}/>, content: "1일 전", set: true, day: 1, hour: 0, minute: 0},
    {id: 6, icon: <img src={before_2D}/>, content: "2일 전", set: true, day: 2, hour: 0, minute: 0},
    {id: 7, icon: <img src={custom}/>, content: "사용자 지정", set: true, day: 0, hour: 0, minute: 0},
]//사용자 지정은 변경해야함

export default Reminder
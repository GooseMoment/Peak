import styled from "styled-components"

import queryClient from "@queries/queryClient"
import { useMutation } from "@tanstack/react-query"
import { postReminder, deleteReminder } from "@api/notifications.api"

import Detail from "@components/project/common/Detail"

import before_5 from "@assets/project/reminder/before_5.svg"
import before_15 from "@assets/project/reminder/before_15.svg"
import before_30 from "@assets/project/reminder/before_30.svg"
import before_1h from "@assets/project/reminder/before_1h.svg"
import before_1D from "@assets/project/reminder/before_1D.svg"
import before_2D from "@assets/project/reminder/before_2D.svg"

const Reminder = ({ task, closeComponent }) => {
    const postMutation = useMutation({
        mutationFn: (data) => {
            return postReminder(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['task', {taskID: task.id}]})
            queryClient.invalidateQueries({queryKey: ['tasks', {drawerID: task.drawer}]})
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (reminderId) => {
            return deleteReminder(reminderId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['task', {taskID: task.id}]})
            queryClient.invalidateQueries({queryKey: ['tasks', {drawerID: task.drawer}]})
        },
    })

    const handleReminder = (delta) => {
        return async () => {
            for (let i=0; i < task.reminders.length; i++) {
                if (task.reminders[i].delta === delta) {
                    deleteMutation.mutate(task.reminders[i].id)
                    return
            }}
            postMutation.mutate({
                "task": task.id,
                "delta": delta,
            })
        }
    }

    return (
        <Detail title="알람 설정" onClose={closeComponent}>
            {items.map(item => (
                <ItemBlock key={item.id}>
                    {item.icon}
                    <ItemText onClick={handleReminder(item.delta)}>{item.content}</ItemText>
                </ItemBlock>
            ))}
        </Detail>
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
    {id: 0, icon: <img src={before_5}/>, content: "5분 전", delta: 5},
    {id: 1, icon: <img src={before_15}/>, content: "15분 전", delta: 15},
    {id: 2, icon: <img src={before_30}/>, content: "30분 전", delta: 30},
    {id: 3, icon: <img src={before_1h}/>, content: "1시간 전", delta: 60},
    {id: 4, icon: <img src={before_1D}/>, content: "1일 전", delta: 1440},
    {id: 5, icon: <img src={before_2D}/>, content: "2일 전", delta: 2880},
]

export default Reminder
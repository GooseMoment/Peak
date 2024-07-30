import styled from "styled-components"

import queryClient from "@queries/queryClient"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { postReminder, deleteReminder } from "@api/notifications.api"

import Detail from "@components/project/common/Detail"
import ReminderContents from "@components/project/Creates/ReminderContents"

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

    const getReminderID = (delta) => {
        for (let i=0; i < task.reminders.length; i++) {
            if (task.reminders[i].delta === delta) {
                return task.reminders[i].id
        }}
        return null
    }

    const handleReminder = (delta) => {
        if (!task.due_date) {
            toast.error("알람 설정 전에 기한을 설정해주세요")
            return true
        }
        const id = getReminderID(delta)
        if (id) {
            deleteMutation.mutate(id)
            return
        }
        postMutation.mutate({
            "task": task.id,
            "delta": delta,
        })
    }

    return (
        <Detail title="알람 설정" onClose={closeComponent}>
            {items.map(item => (
                <ReminderContents
                    key={item.id}
                    item={item}
                    reminders={task.reminders}
                    handleReminder={handleReminder}
                    ReminderID={getReminderID(item.delta)}
                />
            ))}
        </Detail>
    )
}

const items = [
    {id: 0, icon: <img src={before_5}/>, content: "5분 전", delta: 5},
    {id: 1, icon: <img src={before_15}/>, content: "15분 전", delta: 15},
    {id: 2, icon: <img src={before_30}/>, content: "30분 전", delta: 30},
    {id: 3, icon: <img src={before_1h}/>, content: "1시간 전", delta: 60},
    {id: 4, icon: <img src={before_1D}/>, content: "1일 전", delta: 1440},
    {id: 5, icon: <img src={before_2D}/>, content: "2일 전", delta: 2880},
]

export default Reminder
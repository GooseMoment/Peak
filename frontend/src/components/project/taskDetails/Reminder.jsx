import { useMutation } from "@tanstack/react-query"

import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import Detail from "@components/project/common/Detail"
import ReminderContents from "@components/project/taskDetails/ReminderContents"

import { deleteReminder, postReminder } from "@api/notifications.api"

import queryClient from "@queries/queryClient"

import before_1D from "@assets/project/reminder/before_1D.svg"
import before_1h from "@assets/project/reminder/before_1h.svg"
import before_2D from "@assets/project/reminder/before_2D.svg"
import before_5 from "@assets/project/reminder/before_5.svg"
import before_15 from "@assets/project/reminder/before_15.svg"
import before_30 from "@assets/project/reminder/before_30.svg"
import before_D from "@assets/project/reminder/before_D.svg"

import { useTranslation } from "react-i18next"

const Reminder = ({ task }) => {
    const { t } = useTranslation(null, { keyPrefix: "task.reminder" })

    const { closeModal } = useModalWindowCloseContext()

    const postMutation = useMutation({
        mutationFn: (data) => {
            return postReminder(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: task.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: task.drawer }],
            })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (reminderId) => {
            return deleteReminder(reminderId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["task", { taskID: task.id }],
            })
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: task.drawer }],
            })
        },
    })

    const getReminderID = (delta) => {
        for (let i = 0; i < task.reminders.length; i++) {
            if (task.reminders[i].delta === delta) {
                return task.reminders[i].id
            }
        }
        return null
    }

    const handleReminder = (delta) => {
        const id = getReminderID(delta)
        if (id) {
            deleteMutation.mutate(id)
            return
        }
        postMutation.mutate({
            task: task.id,
            delta: delta,
        })
    }

    const items = [
        { id: 0, icon: <img src={before_D} />, content: t("then"), delta: 0 },
        {
            id: 1,
            icon: <img src={before_5} />,
            content: t("5_minutes_before"),
            delta: 5,
        },
        {
            id: 2,
            icon: <img src={before_15} />,
            content: t("15_minutes_before"),
            delta: 15,
        },
        {
            id: 3,
            icon: <img src={before_30} />,
            content: t("30_minutes_before"),
            delta: 30,
        },
        {
            id: 4,
            icon: <img src={before_1h} />,
            content: t("1_hour_before"),
            delta: 60,
        },
        {
            id: 5,
            icon: <img src={before_1D} />,
            content: t("1_day_before"),
            delta: 1440,
        },
        {
            id: 6,
            icon: <img src={before_2D} />,
            content: t("2_days_before"),
            delta: 2880,
        },
    ]

    return (
        <Detail title={t("title")} onClose={closeModal}>
            {items.map((item) => (
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

export default Reminder

import { useMemo } from "react"

import { useTheme } from "styled-components"

import Module, { Title } from "@components/home/Module"
import VGraph from "@components/home/VGraph"
import { getProjectColor } from "@components/project/Creates/palettes"

const AssignedToday = () => {
    const theme = useTheme()
    const data = mockData
    const items = useMemo(() => flattenTasks(data, theme), [data, theme])

    return (
        <Module>
            <Title underline to="/app/today">{data.length} tasks assigned today</Title>
            <VGraph items={items} />
        </Module>
    )
}

const flattenTasks = (tasks, theme) => {
    const flatten = {}

    for (let i in tasks) {
        if (tasks[i].project_id in flatten) {
            flatten[tasks[i].project_id].count += 1
            continue
        }

        flatten[tasks[i].project_id] = {
            name: tasks[i].project_name,
            color: getProjectColor(theme.type, tasks[i].project_color),
            count: 1,
        }
    }

    const items = Object.values(flatten)
    for (let i in items) {
        items[i].width = (items[i].count / tasks.length) * 100
    }

    return items
}

const mockData = [
    {
        project_id: "1111",
        project_name: "School",
        project_color: "orange",
    },
    {
        project_id: "2222",
        project_name: "Life",
        project_color: "yellow",
    },
    {
        project_id: "3333",
        project_name: "Healthy",
        project_color: "blue",
    },
    {
        project_id: "3333",
        project_name: "Healthy",
        project_color: "blue",
    },
    {
        project_id: "1111",
        project_name: "School",
        project_color: "orange",
    },
    {
        project_id: "1111",
        project_name: "School",
        project_color: "orange",
    },
    {
        project_id: "2222",
        project_name: "Life",
        project_color: "yellow",
    },
    {
        project_id: "2222",
        project_name: "Life",
        project_color: "yellow",
    },
    {
        project_id: "2222",
        project_name: "Life",
        project_color: "yellow",
    },
    {
        project_id: "2222",
        project_name: "Life",
        project_color: "yellow",
    },
]

export default AssignedToday

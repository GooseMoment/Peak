import { useState } from "react"

import TaskCommonDetail from "@components/project/taskDetails/TaskCommonDetail"

const TaskCreate = ({ project, drawer, color }) => {
    const [newTask, setNewTask] = useState({
        name: "",
        assigned_at: null,
        due_type: null,
        due_date: null,
        due_datetime: null,
        reminders: [],
        priority: 0,
        project_id: project.id,
        project_name: project.name,
        drawer: drawer.id,
        drawer_name: drawer.name,
        memo: "",
        privacy: "public",
        completed_at: null,
    })

    return (
        <TaskCommonDetail
            newTask={newTask}
            setNewTask={setNewTask}
            projectType={project.type}
            color={color}
            isCreating
        />
    )
}

export default TaskCreate

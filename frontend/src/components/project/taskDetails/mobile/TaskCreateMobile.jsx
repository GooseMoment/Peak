import { useState } from "react"

import TaskCommonDetailMobile from "@components/project/taskDetails/mobile/TaskCommonDetailMobile"

const TaskCreateMobile = ({ closeCreate, project, drawer, color }) => {
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
        <TaskCommonDetailMobile
            newTask={newTask}
            setNewTask={setNewTask}
            projectType={project.type}
            color={color}
            onClose={closeCreate}
            isCreating
        />
    )
}

export default TaskCreateMobile

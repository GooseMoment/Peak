import { useState } from "react"
import { useLocation, useOutletContext } from "react-router-dom"

import TaskCommonDetail from "./TaskCommonDetail"

const TaskCreate = () => {
    const [projectID, projectType, color] = useOutletContext()
    const { state } = useLocation()

    const [newTask, setNewTask] = useState({
        name: "",
        assigned_at: null,
        due_type: null,
        due_date: null,
        due_datetime: null,
        reminders: [],
        priority: 0,
        project_id: state?.project_id,
        project_name: state?.project_name,
        drawer: state?.drawer_id,
        drawer_name: state?.drawer_name,
        memo: "",
        privacy: "public",
        completed_at: null,
    })

    return (
        <TaskCommonDetail
            newTask={newTask}
            setNewTask={setNewTask}
            projectID={projectID}
            projectType={projectType}
            color={color}
            isCreating
        />
    )
}

export default TaskCreate

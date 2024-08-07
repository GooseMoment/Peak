import { useState } from "react"
import { useLocation, useNavigate, useOutletContext } from "react-router-dom"

import styled from "styled-components"

import Button from "@components/common/Button"
import TaskNameInput from "@components/tasks/TaskNameInput"

import Contents from "./Contents"

import { postTask } from "@api/tasks.api"

import queryClient from "@queries/queryClient"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskCreate = () => {
    const { t } = useTranslation(null, { keyPrefix: "project.create" })

    const [projectId, color] = useOutletContext()
    const { state } = useLocation()
    const navigate = useNavigate()

    const [newTaskName, setNewTaskName] = useState(null)

  const onClose = () => {
    navigate(`/app/projects/${projectId}`);
  };

    const [newTask, setNewTask] = useState({
        name: newTaskName,
        assigned_at: null,
        due_date: null,
        due_time: null,
        reminders: [],
        priority: 0,
        drawer: state?.drawer_id,
        drawer_name: state?.drawer_name,
        project_name: state?.project_name,
        memo: "",
        privacy: "public",
    })

  const editNewTask = (edit) => {
    setNewTask(Object.assign(newTask, edit))
  }

    const makeTask = async () => {
        try {
            editNewTask({ name: newTaskName })
            await postTask(newTask)
            toast.success(t("task_create_success"))
            queryClient.invalidateQueries({
                queryKey: ["tasks", { drawerID: state?.drawer_id }],
            })
            onClose()
        } catch (e) {
            if (newTask?.name) toast.error(t("task_create_error"))
            else toast.error(t("task_create_no_name"))
        }
    }

    return (
        <TaskCreateBox>
            <TaskNameBox>
                <TaskNameInput
                    task={newTask}
                    setFunc={editNewTask}
                    newTaskName={newTaskName}
                    setNewTaskName={setNewTaskName}
                    color={color}
                />
                <Icons>
                    <FeatherIcon icon="x" onClick={onClose} />
                </Icons>
            </TaskNameBox>
            <Contents task={newTask} setFunc={editNewTask} />
            <AddButton onClick={makeTask}>{t("button_add")}</AddButton>
        </TaskCreateBox>
    )
}

const TaskCreateBox = styled.div`
    width: 50em;
    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 1px ${(p) => p.theme.secondBackgroundColor};
    border-radius: 15px;

  &::after {
    content: " ";
    display: block;
    height: 0;
    clear: both;
  }
`;

const TaskNameBox = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1em 1.8em;
`;

const Icons = styled.div`
  display: flex;
  align-items: center;

    & svg {
        top: 0.4em;
        cursor: pointer;
        stroke: ${(p) => p.theme.goose};
        margin-left: 1em;
    }
`

const AddButton = styled(Button)`
  float: right;
  margin: 1em;
  margin-right: 2.5em;
  margin-bottom: 1.5em;
`;

export default TaskCreate;

export default TaskCreate

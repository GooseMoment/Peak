import { useMemo, useRef, useState } from "react"

import { useMutation } from "@tanstack/react-query"
import { useTheme } from "styled-components"

import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import Color from "@components/project/Creates/Color"
import Privacy from "@components/project/Creates/Privacy"
import Type from "@components/project/Creates/Type"
import { getProjectColor } from "@components/project/Creates/palettes"
import Middle from "@components/project/common/Middle"
import TitleInput from "@components/project/common/TitleInput"
import EditBox from "@components/project/edit/EditBox"

import { postProject } from "@api/projects.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const ProjectCreate = () => {
    const { t } = useTranslation(null, { keyPrefix: "project" })
    const theme = useTheme()
    const inputRef = useRef(null)

    const [name, setName] = useState("")

    const [newProject, setNewProject] = useState({
        name: name,
        color: "orange",
        privacy: "public",
        type: "regular",
    })

    const { closeModal } = useModalWindowCloseContext()

    const editNewProject = (edit) => {
        setNewProject(Object.assign(newProject, edit))
        inputRef.current.focus()
    }

    //Component
    const [isComponentOpen, setIsComponentOpen] = useState(false)

    const items = useMemo(
        () => makeItems(t, theme, newProject, editNewProject),
        [t, theme, newProject, editNewProject],
    )

    const postMutation = useMutation({
        mutationFn: (data) => {
            return postProject(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
            toast.success(t("create.project_create_success"))
            closeModal()
        },
        onError: () => {
            if (newProject.name)
                toast.error(t("create.project_create_error"), {
                    toastId: "project_create_error",
                })
            else
                toast.error(t("create.project_create_no_name"), {
                    toastId: "project_create_no_name",
                })
        },
    })

    const submit = () => {
        editNewProject({ name })

        if (newProject.name === "Inbox" || newProject.name === "inbox") {
            toast.error(t("create.project_create_cannot_use_inbox"))
            return
        }

        postMutation.mutate(newProject)
    }

    const onEnter = (e) => {
        if (e.key === "Enter") {
            submit()
        }
    }

    return (
        <EditBox onKeyDown={onEnter}>
            <TitleInput
                name={name}
                setName={setName}
                setFunc={editNewProject}
                inputRef={inputRef}
                isCreate
                icon="archive"
                onClose={closeModal}
            />
            <Middle
                items={items}
                isCreate
                submit={submit}
                isComponentOpen={isComponentOpen}
                setIsComponentOpen={setIsComponentOpen}
                disabled={postMutation.isPending}
            />
        </EditBox>
    )
}

const makeItems = (t, theme, project, setFunc) => [
    {
        id: 1,
        icon: "circle",
        color: getProjectColor(theme.type, project.color),
        display: t("color." + project.color),
        component: <Color setColor={setFunc} />,
    },
    {
        id: 2,
        icon: "server",
        display: t("privacy." + project.privacy),
        component: <Privacy setPrivacy={setFunc} />,
    },
    {
        id: 3,
        icon: "award",
        display: t("type." + project.type),
        component: <Type setType={setFunc} />,
    },
]

export default ProjectCreate

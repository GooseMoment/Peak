import { useEffect, useMemo, useRef, useState } from "react"

import { useMutation } from "@tanstack/react-query"
import { useTheme } from "styled-components"

import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import { getProjectColor } from "@components/project/Creates/palettes"
import Color from "@components/project/edit/Color"
import EditBox from "@components/project/edit/EditBox"
import Middle from "@components/project/edit/Middle"
import Privacy from "@components/project/edit/Privacy"
import TitleInput from "@components/project/edit/TitleInput"
import Type from "@components/project/edit/Type"

import { patchProject } from "@api/projects.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const ProjectEdit = ({ project, isCreating = false }) => {
    const { t } = useTranslation(null, { keyPrefix: "project" })
    const theme = useTheme()
    const inputRef = useRef(null)
    const { closeModal } = useModalWindowCloseContext()

    const [newProject, setNewProject] = useState(project)

    useEffect(() => {
        setNewProject(project)
    }, [project])

    const patchMutation = useMutation({
        mutationFn: (data) => {
            return patchProject(project.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects", project.id],
            })
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            })
        },
        onError: () => {
            toast.error(t("edit.project_change_error"))
        },
    })

    const handleChange = (diff) => {
        setNewProject(Object.assign({}, newProject, diff))
        inputRef.current.focus()
    }

    const submit = () => {
        if (newProject.name.trim() === "") {
            toast.error(t("create.project_create_no_name"))
            return
        }

        if (newProject.name.toLowerCase() === "inbox") {
            toast.error(t("create.project_create_cannot_use_inbox"))
            return
        }

        patchMutation.mutate(newProject)
    }

    const items = useMemo(
        () => makeItems(t, theme, newProject, handleChange),
        [t, theme, newProject, handleChange],
    )

    return (
        <EditBox>
            <TitleInput
                name={newProject.name}
                setName={(name) => handleChange({ name })}
                setFunc={handleChange}
                inputRef={inputRef}
                isCreating={isCreating}
                icon="archive"
                onClose={closeModal}
            />
            <Middle items={items} isCreating={isCreating} submit={submit} />
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

export default ProjectEdit

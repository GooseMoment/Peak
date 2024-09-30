import { useMemo, useRef, useState } from "react"

import { useMutation } from "@tanstack/react-query"
import { useTheme } from "styled-components"

import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import { getProjectColor } from "@components/project/Creates/palettes"
import Color from "@components/project/edit/Color"
import EditBox from "@components/project/edit/EditBox"
import Middle from "@components/project/edit/Middle"
import Privacy from "@components/project/edit/Privacy"
import ProjectType from "@components/project/edit/ProjectType"
import TitleInput from "@components/project/edit/TitleInput"

import { patchProject, postProject } from "@api/projects.api"

import useScreenType from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const projectDefault = {
    name: "",
    color: "orange",
    privacy: "public",
    type: "regular",
}

const ProjectEdit = ({ project, isCreating = false }) => {
    const { t } = useTranslation(null, { keyPrefix: "project_drawer_edit" })
    const theme = useTheme()
    const { closeModal } = useModalWindowCloseContext()
    const { isDesktop } = useScreenType()

    const [newProject, setNewProject] = useState(
        isCreating ? projectDefault : project,
    )
    const inputRef = useRef(null)

    const mutation = useMutation({
        mutationFn: (data) => {
            if (isCreating) {
                return postProject(data)
            }

            return patchProject(project.id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            })

            if (isCreating) {
                toast.success(t("created_project"))
            } else {
                queryClient.invalidateQueries({
                    queryKey: ["projects", project.id],
                })
                toast.success(t("edited"))
            }
            closeModal()
        },
        onError: () => {
            if (isCreating) {
                toast.error(t("created_project_error"))
                return
            }

            toast.error(t("edited_error"))
        },
    })

    const handleChange = (diff) => {
        setNewProject(Object.assign({}, newProject, diff))

        if (isDesktop) {
            inputRef.current.focus()
        }
    }

    const submit = () => {
        if (newProject.name.trim() === "") {
            toast.error(t("name_required"))
            return
        }

        if (newProject.name.toLowerCase() === "inbox") {
            toast.error(t("project_cannot_name_inbox"))
            return
        }

        mutation.mutate(newProject)
    }

    const onEnter = (e) => {
        if (e.repeat) {
            return
        }

        if (e.key === "Enter") {
            e.preventDefault()
            submit()
        }
    }

    const items = useMemo(
        () => makeItems(t, theme, newProject, handleChange),
        [t, theme, newProject, handleChange],
    )

    return (
        <EditBox onKeyDown={onEnter}>
            <TitleInput
                name={newProject.name}
                setName={(name) => handleChange({ name })}
                inputRef={inputRef}
                icon="archive"
                onClose={closeModal}
            />
            <Middle items={items} isCreating={isCreating} submit={submit} />
        </EditBox>
    )
}

const makeItems = (t, theme, project, setFunc) => [
    {
        id: "color",
        icon: "circle",
        color: getProjectColor(theme.type, project.color),
        display: t("color." + project.color),
        component: <Color setColor={setFunc} />,
    },
    {
        id: "privacy",
        icon: "server",
        display: t("privacy." + project.privacy),
        component: <Privacy setPrivacy={setFunc} />,
    },
    {
        id: "type",
        icon: "award",
        display: t("type." + project.type),
        component: <ProjectType setType={setFunc} />,
    },
]

export default ProjectEdit

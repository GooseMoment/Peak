import { useMemo, useRef, useState } from "react"

import { useMutation } from "@tanstack/react-query"
import { useTheme } from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import Color from "@components/project/edit/Color"
import EditBox from "@components/project/edit/EditBox"
import Middle from "@components/project/edit/Middle"
import Privacy from "@components/project/edit/Privacy"
import ProjectType from "@components/project/edit/ProjectType"
import TitleInput from "@components/project/edit/TitleInput"

import { patchProject, postProject } from "@api/projects.api"

import useScreenType from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { getPaletteColor } from "@assets/palettes"

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
    const hasCreated = useRef(false)

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
        onError: (err) => {
            if (isCreating) {
                hasCreated.current = false

                const errorCode = err?.response?.data?.code
                toast.error(t("created_project_error." + errorCode))

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
        if (mutation.isPending || hasCreated.current) {
            return
        }

        if (isCreating) {
            hasCreated.current = true
        }

        if (newProject.name.trim() === "") {
            toast.error(t("name_required"))
            inputRef.current.focus()
            return
        }

        if (newProject.name.toLowerCase() === "inbox") {
            toast.error(t("project_cannot_name_inbox"))
            inputRef.current.focus()
            return
        }

        mutation.mutate(newProject)
    }

    const onEnter = (e) => {
        if (e.repeat) {
            e.preventDefault()
            return
        }

        if (e.key !== "Enter") {
            return
        }

        submit()
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
            <Middle items={items} />
            <ButtonGroup $justifyContent="right">
                <Button
                    disabled={mutation.isPending}
                    loading={mutation.isPending}
                    onClick={submit}>
                    {t(isCreating ? "button_add" : "button_save")}
                </Button>
            </ButtonGroup>
        </EditBox>
    )
}

const makeItems = (t, theme, project, setFunc) => [
    {
        id: "color",
        icon: "circle",
        color: getPaletteColor(theme.type, project.color),
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

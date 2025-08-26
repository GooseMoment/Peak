import { KeyboardEvent, useMemo, useRef, useState } from "react"

import { useMutation } from "@tanstack/react-query"
import { useTheme } from "styled-components"
import { DefaultTheme } from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import ColorEdit from "@components/project/edit/ColorEdit"
import EditBox from "@components/project/edit/EditBox"
import Middle from "@components/project/edit/Middle"
import PrivacyEdit from "@components/project/edit/PrivacyEdit"
import ProjectTypeEdit from "@components/project/edit/ProjectTypeEdit"
import TitleInput from "@components/project/edit/TitleInput"

import { type Project, patchProject, postProject } from "@api/projects.api"

import useScreenType from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { getPaletteColor } from "@assets/palettes"

import { AxiosError } from "axios"
import { TFunction } from "i18next"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

type ProjectCreateInput = Pick<Project, "name" | "color" | "privacy" | "type">

const projectDefault = {
    name: "",
    color: "orange" as const,
    privacy: "public" as const,
    type: "regular" as const,
}

const ProjectEdit = ({ project }: { project?: Project }) => {
    const { t } = useTranslation("translation", {
        keyPrefix: "project_drawer_edit",
    })
    const theme = useTheme()
    const { closeModal } = useModalWindowCloseContext()
    const { isDesktop } = useScreenType()

    const [newProject, setNewProject] = useState<ProjectCreateInput | Project>(
        project || projectDefault,
    )
    const inputRef = useRef<HTMLInputElement>(null)
    const hasCreated = useRef(false)

    const mutation = useMutation({
        mutationFn: (data: Partial<Project>) => {
            if (project) {
                return patchProject(project.id, data)
            }
            return postProject(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            })

            if (project) {
                queryClient.invalidateQueries({
                    queryKey: ["projects", project.id],
                })
                queryClient.invalidateQueries({
                    queryKey: ["drawers", { projectID: project.id }],
                })
                toast.success(t("edited"))
            } else {
                toast.success(t("created_project"))
            }
            closeModal()
        },
        onError: (err) => {
            if (project) {
                toast.error(t("edited_error"))
                return
            }
            hasCreated.current = false

            if ("response" in err) {
                const errorCode = (err as AxiosError<{ code: string }>).response
                    ?.data?.code

                if (errorCode === "PROJECT_NAME_DUPLICATE") {
                    toast.error(
                        t("created_project_error.PROJECT_NAME_DUPLICATE"),
                    )
                } else {
                    toast.error(t("created_project_error.UNKNOWN_ERROR"))
                }
            }
        },
    })

    const handleChange = (diff: Partial<Project>) => {
        setNewProject(Object.assign({}, newProject, diff))

        if (isDesktop) {
            inputRef.current?.focus()
        }
    }

    const submit = () => {
        if (mutation.isPending || hasCreated.current) {
            return
        }

        if (!project) {
            hasCreated.current = true
        }

        if (newProject.name.trim() === "") {
            toast.error(t("name_required"))
            inputRef.current?.focus()
            return
        }

        if (newProject.name.toLowerCase() === "inbox") {
            toast.error(t("project_cannot_name_inbox"))
            inputRef.current?.focus()
            return
        }

        mutation.mutate(newProject)
    }

    const onEnter = (e: KeyboardEvent<HTMLDivElement>) => {
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
                setName={(name: string) => handleChange({ name })}
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
                    {t(project ? "button_save" : "button_add")}
                </Button>
            </ButtonGroup>
        </EditBox>
    )
}

const makeItems = (
    t: TFunction<"translation", "project_drawer_edit">,
    theme: DefaultTheme,
    project: Project | ProjectCreateInput,
    setFunc: (diff: Partial<Project>) => void,
) => [
    {
        name: "color",
        icon: "circle" as const,
        color: getPaletteColor(theme.type, project.color),
        display: t(`color.${project.color}`),
        component: <ColorEdit setColor={setFunc} />,
    },
    {
        name: "privacy",
        icon: "server" as const,
        display: t(`privacy.${project.privacy}`),
        component: <PrivacyEdit setPrivacy={setFunc} />,
    },
    {
        name: "type",
        icon: "award" as const,
        display: t(`type.${project.type}`),
        component: <ProjectTypeEdit setType={setFunc} />,
    },
]

export default ProjectEdit

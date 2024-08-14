import { useState } from "react"

import { useMutation } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import { useModalWindowCloseContext } from "@components/common/ModalWindow"
import Color from "@components/project/Creates/Color"
import Privacy from "@components/project/Creates/Privacy"
import Type from "@components/project/Creates/Type"
import { getProjectColor } from "@components/project/Creates/palettes"
import Middle from "@components/project/common/Middle"
import Title from "@components/project/common/Title"

import { postProject } from "@api/projects.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const ProjectCreate = () => {
    const { t } = useTranslation(null, { keyPrefix: "project" })
    const theme = useTheme()

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
    }

    //Component
    const [isComponentOpen, setIsComponentOpen] = useState(false)

    const items = [
        {
            id: 1,
            icon: "circle",
            color: getProjectColor(theme.type, newProject.color),
            display: t("color." + newProject.color),
            component: <Color setColor={editNewProject} />,
        },
        {
            id: 2,
            icon: "server",
            display: t("privacy." + newProject.privacy),
            component: <Privacy setPrivacy={editNewProject} />,
        },
        {
            id: 3,
            icon: "award",
            display: t("type." + newProject.type),
            component: <Type setType={editNewProject} />,
        },
    ]

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

    return (
        <ProjectCreateBox>
            <Title
                name={name}
                setName={setName}
                setFunc={editNewProject}
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
            />
        </ProjectCreateBox>
    )
}

const ProjectCreateBox = styled.div`
    width: 35em;
    background-color: ${(p) => p.theme.backgroundColor};
    border: solid 1px ${(p) => p.theme.project.borderColor};
    border-radius: 15px;

    &::after {
        content: " ";
        display: block;
        height: 0;
        clear: both;
    }
`

export default ProjectCreate

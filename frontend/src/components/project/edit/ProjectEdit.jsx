import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import styled from "styled-components"

import Middle from "@components/project/common/Middle"
import Title from "@components/project/common/Title"

import Color from "@components/project/Creates/Color"
import Privacy from "@components/project/Creates/Privacy"
import Type from "@components/project/Creates/Type"

import { getProject, patchProject } from "@api/projects.api"

import queryClient from "@queries/queryClient"

import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"
import { useMutation } from "@tanstack/react-query"

const ProjectEdit = ({ onClose }) => {
    const { t } = useTranslation(null, { keyPrefix: "project.edit" })
    const { id } = useParams()

    const {
        isPending,
        isError,
        data: project,
    } = useQuery({
        queryKey: ["projects", { project: id }],
        queryFn: () => getProject(id),
    })

    const [name, setName] = useState("")

    useEffect(() => {
        setName(project?.name)
    }, [project])

    //Component
    const [isComponentOpen, setIsComponentOpen] = useState(false)

    const closeComponent = () => {
        setIsComponentOpen(false)
    }

    const patchMutation = useMutation({
        mutationFn: (data) => {
            return patchProject(id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
        onError: () => {
            toast.error(t("project_change_error"))
        }
    })

    const items = [
        {
            id: 1,
            icon: "circle",
            color: project?.color,
            display: "빨강",
            component: (
                <Color
                    setColor={patchMutation.mutate}
                    setDisplayColor={()=>{}}
                    closeComponent={closeComponent}
                />
            ),
        },
        {
            id: 2,
            icon: "server",
            display: t("privacy." + project?.privacy),
            component: (
                <Privacy
                    setPrivacy={patchMutation.mutate}
                    closeComponent={closeComponent}
                />
            ),
        },
        {
            id: 3,
            icon: "award",
            display: t("type." + project?.type),
            component: (
                <Type
                    setType={patchMutation.mutate}
                    closeComponent={closeComponent}
                />
            ),
        },
    ]

    if (isPending) {
        return (
            <ProjectEditBox/>
        )
    }

    return (
        <ProjectEditBox>
            <Title
                name={name}
                setName={setName}
                setFunc={patchMutation.mutate}
                isCreate={false}
                icon="archive"
                onClose={onClose}
            />
            <Middle
                items={items}
                isCreate={false}
                isComponentOpen={isComponentOpen}
                setIsComponentOpen={setIsComponentOpen}
            />
        </ProjectEditBox>
    )
}

const ProjectEditBox = styled.div`
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

export default ProjectEdit

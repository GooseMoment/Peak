import { useCallback, useEffect, useState } from "react"

import { useQuery } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import ModalWindow from "@components/common/ModalWindow"
import PageTitle from "@components/common/PageTitle"
import ErrorProjectList from "@components/errors/ErrorProjectList"
import ProjectName from "@components/project/ProjectName"
import ProjectEdit from "@components/project/edit/ProjectEdit"
import SkeletonProjectList from "@components/project/skeletons/SkeletonProjectList"

import { getProjectList, patchProject } from "@api/projects.api"

import { ifMobile } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import FeatherIcon from "feather-icons-react"
import { HTML5Backend } from "react-dnd-html5-backend"
import {
    DndProvider,
    MouseTransition,
    MultiBackend,
    TouchTransition,
} from "react-dnd-multi-backend"
import { TouchBackend } from "react-dnd-touch-backend"
import { useTranslation } from "react-i18next"

const ProjectListPage = () => {
    const { t } = useTranslation(null, { keyPrefix: "project_list" })

    const [projects, setProjects] = useState([])
    const [isCreateOpen, setIsCreateOpen] = useState(false)

    const { isPending, isError, data, refetch } = useQuery({
        queryKey: ["projects"],
        queryFn: () => getProjectList(),
    })

    useEffect(() => {
        if (!data) return
        setProjects(data)
    }, [data])

    const patchMutation = useMutation({
        mutationFn: ({ id, order }) => {
            return patchProject(id, { order })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["projects"],
            })
            refetch()
        },
    })

    const moveProject = useCallback((dragIndex, hoverIndex) => {
        setProjects((prevProjects) => {
            const updatedProjects = [...prevProjects]
            const [moved] = updatedProjects.splice(dragIndex, 1)
            updatedProjects.splice(hoverIndex, 0, moved)
            return updatedProjects
        })
    }, [])

    const dropProject = useCallback(() => {
        const changedProjects = projects
            .map((project, index) => ({ id: project.id, order: index }))
            .filter((project, index) => data[index]?.id !== project.id)

        changedProjects.forEach(({ id, order }) => {
            patchMutation.mutate({ id, order })
        })
    }, [projects, data])

    const HTML5toTouch = {
        backends: [
            {
                id: "html5",
                backend: HTML5Backend,
                transition: MouseTransition,
            },
            {
                id: "touch",
                backend: TouchBackend,
                options: { enableMouseEvents: true },
                preview: true,
                transition: TouchTransition,
            },
        ],
    }

    return (
        <>
            <PageTitleBox>
                <PageTitle>{t("title")}</PageTitle>
                {isPending || (
                    <PlusBox
                        onClick={() => {
                            setIsCreateOpen(true)
                        }}>
                        <FeatherIcon icon="plus" />
                    </PlusBox>
                )}
            </PageTitleBox>

            {isPending && <SkeletonProjectList />}
            {isError && <ErrorProjectList onClick={() => refetch()} />}

            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                {projects?.map((project, i) => (
                    <ProjectName
                        key={project.id}
                        project={project}
                        index={i}
                        moveProject={moveProject}
                        dropProject={dropProject}
                    />
                ))}
            </DndProvider>

            {isPending || (
                <ProjectCreateButton
                    onClick={() => {
                        setIsCreateOpen(true)
                    }}>
                    <FeatherIcon icon="plus-circle" />
                    <ProjectCreateText>
                        {t("button_add_project")}
                    </ProjectCreateText>
                </ProjectCreateButton>
            )}
            {isCreateOpen && (
                <ModalWindow
                    afterClose={() => {
                        setIsCreateOpen(false)
                    }}>
                    <ProjectEdit isCreating />
                </ModalWindow>
            )}
        </>
    )
}

const PageTitleBox = styled.div`
    display: flex;
    align-items: center;
`

const PlusBox = styled.div`
    margin-left: 0.8em;
    padding-bottom: 0.8em;
    cursor: pointer;

    & svg {
        width: 16px;
        height: 16px;
        top: 0;
    }
`

const ProjectCreateButton = styled.div`
    display: flex;
    align-items: center;
    padding: 1em 0em;
    margin-left: 0.8em;
    cursor: pointer;

    & svg {
        width: 1.1em;
        height: 1.1em;
        top: 0;
    }

    ${ifMobile} {
        padding: 0.5em 0em;
        margin-left: 0em;
    }
`

const ProjectCreateText = styled.div`
    font-size: 1em;
    font-weight: medium;
    color: ${(p) => p.theme.textColor};
    margin-top: 0em;
`

export default ProjectListPage

import { useCallback, useEffect, useState } from "react"

import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import styled from "styled-components"

import ModalWindow from "@components/common/ModalWindow"
import PageTitle from "@components/common/PageTitle"
import ErrorProjectList from "@components/errors/ErrorProjectList"
import ProjectName from "@components/project/ProjectName"
import ProjectEdit from "@components/project/edit/ProjectEdit"
import SkeletonProjectList from "@components/project/skeletons/SkeletonProjectList"

import {
    type Project,
    getProjectList,
    patchReorderProject,
} from "@api/projects.api"

import HTML5toTouch from "@utils/html5ToTouch"
import { getPageFromURL } from "@utils/pagination"
import { ifMobile } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { ImpressionArea } from "@toss/impression-area"
import FeatherIcon from "feather-icons-react"
import { DndProvider } from "react-dnd-multi-backend"
import { useTranslation } from "react-i18next"

const ProjectListPage = () => {
    const { t } = useTranslation("translation")

    const [projects, setProjects] = useState<Project[]>([])
    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)

    const { data, isPending, isError, refetch, fetchNextPage } =
        useInfiniteQuery({
            queryKey: ["projects"],
            queryFn: (context) => getProjectList(context.pageParam),
            initialPageParam: "1",
            getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
        })

    const { mutateAsync } = useMutation({
        mutationFn: (data: Partial<Project>[]) => {
            return patchReorderProject(data)
        },
    })

    useEffect(() => {
        if (!data) return
        const results = data.pages.flatMap((page) => page.results ?? []) || []
        setProjects(results)
    }, [data])

    const moveProject = useCallback((dragIndex: number, hoverIndex: number) => {
        setProjects((prevProjects) => {
            const updatedProjects = [...prevProjects]
            const [moved] = updatedProjects.splice(dragIndex, 1)
            updatedProjects.splice(hoverIndex, 0, moved)
            return updatedProjects
        })
    }, [])

    const dropProject = useCallback(async () => {
        const results = data?.pages.flatMap((page) => page.results ?? []) || []

        const changedProjects = projects
            .map((project, index) => ({ id: project.id, order: index }))
            .filter((project, index) => {
                const originalIndex = results.findIndex(
                    (p) => p.id === project.id,
                )
                return originalIndex !== index
            })

        if (changedProjects.length === 0) return

        await mutateAsync(changedProjects)
        await queryClient.invalidateQueries({
            queryKey: ["projects"],
        })
    }, [data?.pages, projects, mutateAsync])

    return (
        <>
            <PageTitleBox>
                <PageTitle>{t("project_list.title")}</PageTitle>
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
            {isError && <ErrorProjectList refetch={() => refetch()} />}

            <DndProvider options={HTML5toTouch}>
                {projects.map((project) => (
                    <ProjectName
                        key={project.id}
                        project={project}
                        moveProject={moveProject}
                        dropProject={dropProject}
                        isPending={isPending}
                    />
                ))}
            </DndProvider>

            <ImpressionArea
                onImpressionStart={() => fetchNextPage()}
                timeThreshold={200}></ImpressionArea>

            {isPending || (
                <ProjectCreateButton
                    onClick={() => {
                        setIsCreateOpen(true)
                    }}>
                    <FeatherIcon icon="plus-circle" />
                    <ProjectCreateText>
                        {t("project_list.button_add_project")}
                    </ProjectCreateText>
                </ProjectCreateButton>
            )}
            {isCreateOpen && (
                <ModalWindow
                    afterClose={() => {
                        setIsCreateOpen(false)
                    }}>
                    <ProjectEdit />
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

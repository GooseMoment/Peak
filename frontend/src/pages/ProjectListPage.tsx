import { useCallback, useMemo, useState } from "react"

import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import styled from "styled-components"

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
import useModal, { Portal } from "@utils/useModal"
import { ifMobile } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { ImpressionArea } from "@toss/impression-area"
import FeatherIcon from "feather-icons-react"
import { DndProvider } from "react-dnd-multi-backend"
import { useTranslation } from "react-i18next"

const ProjectListPage = () => {
    const { t } = useTranslation("translation")

    const modal = useModal()

    const {
        data,
        isPending,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["projects"],
        queryFn: (context) => getProjectList(context.pageParam),
        initialPageParam: "1",
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    const projects = useMemo(() => {
        if (!data) return []
        return data.pages.flatMap((page) => page.results ?? []) || []
    }, [data])

    // Drag and drop state
    const [tempProjectOrder, setTempProjectOrder] = useState<Project[]>([])
    const displayProjects =
        tempProjectOrder.length > 0 ? tempProjectOrder : projects

    const { mutateAsync } = useMutation({
        mutationFn: (data: Partial<Project>[]) => {
            return patchReorderProject(data)
        },
    })

    const moveProject = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const updatedOrder = [...displayProjects]
            const [moved] = updatedOrder.splice(dragIndex, 1)
            updatedOrder.splice(hoverIndex, 0, moved)
            setTempProjectOrder(updatedOrder)
        },
        [displayProjects],
    )

    const dropProject = useCallback(async () => {
        const changedProjects = displayProjects
            .map((project, index) => ({ id: project.id, order: index }))
            .filter((project, index) => {
                const originalIndex = projects.findIndex(
                    (p) => p.id === project.id,
                )
                return originalIndex !== index
            })

        if (changedProjects.length === 0) return

        await mutateAsync(changedProjects)
        await queryClient.invalidateQueries({
            queryKey: ["projects"],
        })
        // Reset temp order after successful API update
        setTempProjectOrder([])
    }, [projects, displayProjects, mutateAsync])

    return (
        <>
            <PageTitleBox>
                <PageTitle>{t("project_list.title")}</PageTitle>
                {isPending || (
                    <PlusBox
                        onClick={() => {
                            modal.openModal()
                        }}>
                        <FeatherIcon icon="plus" />
                    </PlusBox>
                )}
            </PageTitleBox>

            {isPending && <SkeletonProjectList />}
            {isError && <ErrorProjectList refetch={() => refetch()} />}

            <DndProvider options={HTML5toTouch}>
                {displayProjects.map((project) => (
                    <ProjectName
                        key={project.id}
                        project={project}
                        moveProject={moveProject}
                        dropProject={dropProject}
                        isPending={isPending}
                    />
                ))}
            </DndProvider>

            <StyledImpressionArea
                onImpressionStart={() => {
                    if (hasNextPage) fetchNextPage()
                }}
                timeThreshold={200}>
                {isFetchingNextPage && t("common.loading")}
            </StyledImpressionArea>

            {isPending || (
                <ProjectCreateButton
                    onClick={() => {
                        modal.openModal()
                    }}>
                    <FeatherIcon icon="plus-circle" />
                    <ProjectCreateText>
                        {t("project_list.button_add_project")}
                    </ProjectCreateText>
                </ProjectCreateButton>
            )}
            <Portal modal={modal}>
                <ProjectEdit />
            </Portal>
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

const StyledImpressionArea = styled(ImpressionArea)`
    min-height: 24px;
    min-width: 1px;

    display: flex;
    align-items: center;
    justify-content: center;
`

const ProjectCreateText = styled.div`
    font-size: 1em;
    font-weight: medium;
    color: ${(p) => p.theme.textColor};
    margin-top: 0em;
`

export default ProjectListPage

import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import Button, { ButtonGroup } from "@components/common/Button"
import DeleteAlert from "@components/common/DeleteAlert"
import PageTitle from "@components/common/PageTitle"
import DrawerBlock from "@components/drawers/DrawerBlock"
import { ErrorBox } from "@components/errors/ErrorProjectPage"
import OptionsMenu from "@components/project/common/OptionsMenu"
import PrivacyIcon from "@components/project/common/PrivacyIcon"
import Progress from "@components/project/common/Progress"
import DrawerEdit from "@components/project/edit/DrawerEdit"
import ProjectEdit from "@components/project/edit/ProjectEdit"
import { SkeletonProjectPage } from "@components/project/skeletons/SkeletonProjectPage"
import SortIcon from "@components/project/sorts/SortIcon"
import SortMenu from "@components/project/sorts/SortMenu"
import SortMenuMobile from "@components/project/sorts/SortMenuMobile"

import {
    type Drawer,
    getDrawersByProject,
    patchReorderDrawer,
} from "@api/drawers.api"
import { type Project, deleteProject, getProject } from "@api/projects.api"

import HTML5toTouch from "@utils/html5ToTouch"
import { getPageFromURL } from "@utils/pagination"
import useModal, { Portal } from "@utils/useModal"
import useScreenType, { ifMobile } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { getPaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"
import type { TFunction } from "i18next"
import { DndProvider } from "react-dnd-multi-backend"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const ProjectPage = () => {
    const { id } = useParams()
    const theme = useTheme()
    const navigate = useNavigate()
    const { isMobile } = useScreenType()

    const [tempDrawerOrder, setTempDrawerOrder] = useState<Drawer[]>([])

    const [ordering, setOrdering] = useState("order")
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [isSortMenuMobileOpen, setSortMenuMobileOpen] = useState(false)

    const drawerModal = useModal()
    const projectModal = useModal()

    const { t } = useTranslation("translation")

    const sortMenuItems = useMemo(() => makeSortMenuItems(t), [t])

    const {
        isPending: isProjectPending,
        isError: isProjectError,
        data: project,
        refetch: projectRefetch,
    } = useQuery<Project>({
        queryKey: ["projects", id],
        queryFn: () => getProject(id!),
    })

    useEffect(() => {
        if (project?.type === "inbox") {
            navigate("/app/projects/inbox", { replace: true })
        }
    }, [project, navigate])

    const {
        data,
        isPending: isDrawersPending,
        isError: isDrawersError,
        refetch: drawersRefetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["drawers", { projectID: id, ordering: ordering }],
        queryFn: (context) =>
            getDrawersByProject(id!, ordering, context.pageParam),
        initialPageParam: "1",
        getNextPageParam: (lastPage) => getPageFromURL(lastPage.next),
    })

    // Derived state for drawers with temp order during drag operations
    const drawers = useMemo(() => {
        if (!data) return []
        return data.pages.flatMap((page) => page.results ?? []) || []
    }, [data])

    const displayDrawers =
        tempDrawerOrder.length > 0 ? tempDrawerOrder : drawers

    const { mutateAsync } = useMutation({
        mutationFn: (data: Partial<Drawer>[]) => {
            return patchReorderDrawer(data)
        },
    })

    const moveDrawer = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const updatedOrder = [...displayDrawers]
            const [moved] = updatedOrder.splice(dragIndex, 1)
            updatedOrder.splice(hoverIndex, 0, moved)
            setTempDrawerOrder(updatedOrder)
        },
        [displayDrawers],
    )

    const dropDrawer = useCallback(async () => {
        if (!data) return
        const results = data.pages.flatMap((page) => page.results) || []
        const changedDrawers = displayDrawers
            .map((task, index) => ({ id: task.id, order: index }))
            .filter((task, index) => results[index]?.id !== task.id)

        if (changedDrawers.length === 0) return

        try {
            await mutateAsync(changedDrawers)
            await queryClient.invalidateQueries({
                queryKey: ["drawers", { projectID: id, ordering: "order" }],
            })
        } catch (_) {
            toast.error(t("common.error_perform"))
        } finally {
            setOrdering("order")
            setTempDrawerOrder([])
        }
    }, [data, displayDrawers, t, mutateAsync, id])

    const deleteMutation = useMutation({
        mutationFn: () => {
            return deleteProject(id!)
        },
        onSuccess: () => {
            toast.success(
                t("project.delete.project_delete_success", {
                    project_name: project?.name,
                }),
            )
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
        onError: () => {
            toast.error(
                t("project.delete.project_delete_error", {
                    project_name: project?.name,
                }),
            )
        },
    })

    const handleEdit = () => {
        projectModal.openModal()
    }

    const handleAlert = () => {
        setIsAlertOpen(true)
    }

    const handleDelete = () => {
        navigate(`/app/projects`)
        deleteMutation.mutate()
    }

    const onClickProjectErrorBox = () => {
        projectRefetch()
        drawersRefetch()
    }

    if (isProjectPending || isDrawersPending) {
        return <SkeletonProjectPage />
    }

    if (isProjectError || isDrawersError) {
        return (
            <ErrorBox onClick={onClickProjectErrorBox}>
                <FeatherIcon icon="alert-triangle" />
                {t("project.error_load_project_and_drawer")}
            </ErrorBox>
        )
    }

    const color = getPaletteColor(theme.type, project.color)

    return (
        <>
            <TitleBox>
                <PageTitleBox>
                    <PageTitle $color={color}>{project.name}</PageTitle>
                    <PrivacyIcon
                        privacy={project.privacy}
                        color={color}
                        isProject
                    />
                </PageTitleBox>
                <Icons>
                    <FeatherIcon
                        icon="plus"
                        onClick={() => drawerModal.openModal()}
                    />
                    {
                        <>
                            <SortIconBox>
                                {isMobile ? (
                                    <div
                                        onClick={() =>
                                            setSortMenuMobileOpen(true)
                                        }>
                                        <SortIcon color={theme.textColor} />
                                    </div>
                                ) : (
                                    <SortMenu
                                        color={theme.textColor}
                                        items={sortMenuItems}
                                        ordering={ordering}
                                        setOrdering={setOrdering}
                                    />
                                )}
                            </SortIconBox>
                            <OptionsMenu
                                handleEdit={handleEdit}
                                handleAlert={handleAlert}
                            />
                        </>
                    }
                </Icons>
            </TitleBox>
            {project.type === "goal" && (
                <Progress project={project} drawers={displayDrawers} />
            )}
            {displayDrawers && displayDrawers.length === 0 ? (
                <NoDrawerText>{t("project.no_drawer")}</NoDrawerText>
            ) : (
                <DndProvider options={HTML5toTouch}>
                    {displayDrawers?.map((drawer) => (
                        <DrawerBlock
                            key={drawer.id}
                            drawer={drawer}
                            moveDrawer={moveDrawer}
                            dropDrawer={dropDrawer}
                        />
                    ))}
                </DndProvider>
            )}
            {isDrawersPending ||
                (hasNextPage ? (
                    <ButtonGroup $justifyContent="center" $margin="1em">
                        <MoreButton
                            disabled={isFetchingNextPage}
                            loading={isFetchingNextPage}
                            onClick={() => fetchNextPage()}>
                            {isDrawersPending
                                ? t("common.loading")
                                : t("common.load_more")}
                        </MoreButton>
                    </ButtonGroup>
                ) : null)}
            {isAlertOpen && (
                <DeleteAlert
                    title={t("project.delete.alert_project_title", {
                        project_name: project.name,
                    })}
                    onClose={() => {
                        setIsAlertOpen(false)
                    }}
                    func={handleDelete}
                />
            )}
            {isSortMenuMobileOpen && (
                <SortMenuMobile
                    title={t("project.sort.drawer_title")}
                    items={sortMenuItems}
                    onClose={() => setSortMenuMobileOpen(false)}
                    ordering={ordering}
                    setOrdering={setOrdering}
                />
            )}
            <Portal modal={drawerModal}>
                <DrawerEdit />
            </Portal>
            <Portal modal={projectModal}>
                <ProjectEdit project={project} />
            </Portal>
        </>
    )
}

const TitleBox = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const PageTitleBox = styled.div`
    display: flex;
    align-items: center;
`

const Icons = styled.div`
    display: flex;
    align-items: center;
    gap: 1em;
    margin-bottom: 1em;
    margin-right: 1em;

    & svg {
        cursor: pointer;
    }

    ${ifMobile} {
        margin-right: 0;
        gap: 0.5em;
    }
`

const SortIconBox = styled.div`
    & svg {
        position: relative;
        top: 0.17em;
        margin-right: 0.5em;
    }
`

const NoDrawerText = styled.div`
    margin-top: 2em;
    font-weight: 600;
    font-size: 1.4em;
`

const MoreButton = styled(Button)`
    width: 80%;
`

const makeSortMenuItems = (t: TFunction<"translation", "project">) => [
    { display: t("sort.my"), context: "order" },
    { display: t("sort.name"), context: "name" },
    { display: t("sort.-name"), context: "-name" },
    { display: t("sort.created_at"), context: "created_at" },
    { display: t("sort.-created_at"), context: "-created_at" },
    {
        display: t("sort.-uncompleted_task_count"),
        context: "-uncompleted_task_count",
    },
    {
        display: t("sort.-completed_task_count"),
        context: "-completed_task_count",
    },
    {
        display: t("sort.completed_task_count"),
        context: "completed_task_count",
    },
]

export default ProjectPage

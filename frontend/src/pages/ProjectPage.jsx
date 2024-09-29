import { Suspense, useEffect, useMemo, useState } from "react"
import { Outlet, useNavigate, useParams } from "react-router-dom"

import { useMutation, useQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import ContextMenu from "@components/common/ContextMenu"
import DeleteAlert from "@components/common/DeleteAlert"
import ModalLoader from "@components/common/ModalLoader"
import ModalWindow from "@components/common/ModalWindow"
import PageTitle from "@components/common/PageTitle"
import Drawer from "@components/drawers/Drawer"
import { ErrorBox } from "@components/errors/ErrorProjectPage"
import DrawerCreate from "@components/project/Creates/DrawerCreate"
import { getProjectColor } from "@components/project/Creates/palettes"
import Progress from "@components/project/common/Progress"
import ProjectEdit from "@components/project/edit/ProjectEdit"
import { SkeletonProjectPage } from "@components/project/skeletons/SkeletonProjectPage"
import SortIcon from "@components/project/sorts/SortIcon"
import SortMenu from "@components/project/sorts/SortMenu"

import { getDrawersByProject } from "@api/drawers.api"
import { deleteProject, getProject } from "@api/projects.api"

import handleToggleContextMenu from "@utils/handleToggleContextMenu"

import queryClient from "@queries/queryClient"

import FeatherIcon from "feather-icons-react"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const ProjectPage = () => {
    const { id } = useParams()
    const theme = useTheme()
    const navigate = useNavigate()

    const [isDrawerCreateOpen, setIsDrawerCreateOpen] = useState(false)
    const [ordering, setOrdering] = useState("created_at")
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
    const [selectedSortMenuPosition, setSelectedSortMenuPosition] = useState({
        top: 0,
        left: 0,
    })
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [selectedButtonPosition, setSelectedButtonPosition] = useState({
        top: 0,
        left: 0,
    })
    const [isProjectEditOpen, setIsProjectEditOpen] = useState(false)

    const { t } = useTranslation(null, { keyPrefix: "project" })

    const {
        isLoading: isProjectLoading,
        isError: isProjectError,
        data: project,
        refetch: projectRefetch,
    } = useQuery({
        queryKey: ["projects", id],
        queryFn: () => getProject(id),
    })

    const {
        isLoading: isDrawersLoading,
        isError: isDrawersError,
        data: drawers,
        refetch: drawersRefetch,
    } = useQuery({
        queryKey: ["drawers", { projectID: id, ordering: ordering }],
        queryFn: () => getDrawersByProject(id, ordering),
    })

    useEffect(() => {
        setIsContextMenuOpen(false)
        setIsSortMenuOpen(false)
    }, [project])

    const deleteMutation = useMutation({
        mutationFn: () => {
            return deleteProject(id)
        },
        onSuccess: () => {
            toast.success(
                t("delete.project_delete_success", {
                    project_name: project.name,
                }),
            )
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
        onError: () => {
            toast.error(
                t("delete.project_delete_error", {
                    project_name: project.name,
                }),
            )
        },
    })

    const handleEdit = () => {
        setIsContextMenuOpen(false)
        setIsProjectEditOpen(true)
    }

    const handleAlert = () => {
        setIsContextMenuOpen(false)
        setIsAlertOpen(true)
    }

    const sortMenuItems = useMemo(() => makeSortMenuItems(t), [t])
    const contextMenuItems = useMemo(
        () => makeContextMenuItems(t, theme, handleEdit, handleAlert),
        [t, theme],
    )

    const handleDelete = () => {
        navigate(`/app/projects`)
        deleteMutation.mutate()
    }

    const openInboxTaskCreate = () => {
        navigate(`/app/projects/${project.id}/tasks/create/`, {
            state: {
                project_name: project.name,
                drawer_id: project.drawers[0].id,
                drawer_name: project.drawers[0].name,
            },
        })
    }

    const onClickProjectErrorBox = () => {
        projectRefetch()
        drawersRefetch()
    }

    if (isProjectLoading || isDrawersLoading) {
        return <SkeletonProjectPage />
    }

    if (isProjectError || isDrawersError) {
        return (
            <ErrorBox $isTasks={false} onClick={onClickProjectErrorBox}>
                <FeatherIcon icon="alert-triangle" />
                {t("error_load_project_and_drawer")}
            </ErrorBox>
        )
    }

    const color = getProjectColor(theme.type, project?.color)

    return (
        <>
            <TitleBox>
                <PageTitle $color={color}>{project.name}</PageTitle>
                <Icons>
                    <FeatherIcon
                        icon="plus"
                        onClick={
                            project?.type === "inbox"
                                ? openInboxTaskCreate
                                : () => {
                                      setIsDrawerCreateOpen(true)
                                  }
                        }
                    />
                    {project?.type === "inbox" || (
                        <>
                            <SortIconBox
                                onClick={handleToggleContextMenu(
                                    setSelectedSortMenuPosition,
                                    setIsSortMenuOpen,
                                    setIsContextMenuOpen,
                                )}>
                                <SortIcon color={theme.textColor} />
                            </SortIconBox>
                            <FeatherIcon
                                icon="more-horizontal"
                                onClick={handleToggleContextMenu(
                                    setSelectedButtonPosition,
                                    setIsContextMenuOpen,
                                    setIsSortMenuOpen,
                                )}
                            />
                        </>
                    )}
                </Icons>
            </TitleBox>
            {project.type === "goal" && (
                <Progress project={project} drawers={drawers} />
            )}
            {drawers && drawers.length === 0 ? (
                <NoDrawerText>{t("no_drawer")}</NoDrawerText>
            ) : (
                drawers?.map((drawer) => (
                    <Drawer
                        key={drawer.id}
                        project={project}
                        drawer={drawer}
                        color={color}
                    />
                ))
            )}
            {isSortMenuOpen && (
                <SortMenu
                    title={t("sort.drawer_title")}
                    items={sortMenuItems}
                    selectedButtonPosition={selectedSortMenuPosition}
                    ordering={ordering}
                    setOrdering={setOrdering}
                />
            )}
            {isContextMenuOpen && (
                <ContextMenu
                    items={contextMenuItems}
                    selectedButtonPosition={selectedButtonPosition}
                />
            )}
            {isAlertOpen && (
                <DeleteAlert
                    title={t("delete.alert_project_title", {
                        project_name: project.name,
                    })}
                    onClose={() => {
                        setIsAlertOpen(false)
                    }}
                    func={handleDelete}
                />
            )}
            {isDrawerCreateOpen && (
                <ModalWindow
                    afterClose={() => {
                        setIsDrawerCreateOpen(false)
                    }}>
                    <DrawerCreate />
                </ModalWindow>
            )}
            {isProjectEditOpen && (
                <ModalWindow
                    afterClose={() => {
                        setIsProjectEditOpen(false)
                    }}>
                    <ProjectEdit project={project} />
                </ModalWindow>
            )}
            <Suspense key="project-page" fallback={<ModalLoader />}>
                <Outlet context={[id, color]} />
            </Suspense>
        </>
    )
}

const TitleBox = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

const Icons = styled.div`
    display: flex;
    align-items: center;

    & svg {
        cursor: pointer;
        margin-left: 1em;
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

const makeSortMenuItems = (t) => [
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

const makeContextMenuItems = (t, theme, handleEdit, handleAlert) => [
    {
        icon: "edit",
        display: t("edit.display"),
        color: theme.textColor,
        func: handleEdit,
    },
    {
        icon: "trash-2",
        display: t("delete.display"),
        color: theme.project.danger,
        func: handleAlert,
    },
]

export default ProjectPage

import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useMutation, useQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import ContextMenu from "@components/common/ContextMenu"
import DeleteAlert from "@components/common/DeleteAlert"
import ModalWindow from "@components/common/ModalWindow"
import PageTitle from "@components/common/PageTitle"
import Drawer from "@components/drawers/Drawer"
import { ErrorBox } from "@components/errors/ErrorProjectPage"
import PrivacyIcon from "@components/project/common/PrivacyIcon"
import Progress from "@components/project/common/Progress"
import DrawerEdit from "@components/project/edit/DrawerEdit"
import ProjectEdit from "@components/project/edit/ProjectEdit"
import { SkeletonProjectPage } from "@components/project/skeletons/SkeletonProjectPage"
import SortIcon from "@components/project/sorts/SortIcon"
import SortMenuSelector from "@components/project/sorts/SortMenuSelector"
import TaskCreateElement from "@components/project/taskDetails/TaskCreateElement"

import { getDrawersByProject } from "@api/drawers.api"
import { deleteProject, getProject } from "@api/projects.api"

import handleToggleContextMenu from "@utils/handleToggleContextMenu"
import { ifMobile } from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { getPaletteColor } from "@assets/palettes"

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
    const [isCreateOpen, setCreateOpen] = useState(false)

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
        setCreateOpen(true)
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

    const color = getPaletteColor(theme.type, project?.color)

    return (
        <>
            <TitleBox>
                <PageTitleBox>
                    <PageTitle $color={color}>{project.name}</PageTitle>
                    <PrivacyIcon
                        privacy={project.privacy}
                        color={getPaletteColor(theme.type, project.color)}
                        isProject
                    />
                </PageTitleBox>
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
                <SortMenuSelector
                    title={t("sort.drawer_title")}
                    items={sortMenuItems}
                    selectedButtonPosition={selectedSortMenuPosition}
                    onClose={() => setIsSortMenuOpen(false)}
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
                    <DrawerEdit isCreating />
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
            {isCreateOpen && (
                <TaskCreateElement
                    onClose={() => setCreateOpen(false)}
                    project={project}
                    drawer={project.drawers[0]}
                    color={color}
                />
            )}
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

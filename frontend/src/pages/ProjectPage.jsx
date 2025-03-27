import {
    Suspense,
    lazy,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useMutation, useQuery } from "@tanstack/react-query"
import styled, { useTheme } from "styled-components"

import DeleteAlert from "@components/common/DeleteAlert"
import ModalLoader from "@components/common/ModalLoader"
import ModalWindow from "@components/common/ModalWindow"
import PageTitle from "@components/common/PageTitle"
import Drawer from "@components/drawers/Drawer"
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

import { getDrawersByProject, patchReorderDrawer } from "@api/drawers.api"
import { deleteProject, getProject } from "@api/projects.api"

import { ifMobile } from "@utils/useScreenType"
import useScreenType from "@utils/useScreenType"

import queryClient from "@queries/queryClient"

import { getPaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

const TaskCreateElement = lazy(
    () => import("@components/project/taskDetails/TaskCreateElement"),
)

const ProjectPage = () => {
    const { id } = useParams()
    const theme = useTheme()
    const navigate = useNavigate()
    const { isMobile } = useScreenType()

    const [drawers, setDrawers] = useState([])

    const [isDrawerCreateOpen, setIsDrawerCreateOpen] = useState(false)
    const [ordering, setOrdering] = useState("order")
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [isProjectEditOpen, setIsProjectEditOpen] = useState(false)
    const [isSortMenMobileOpen, setSortMenuMobileOpen] = useState(false)
    const [isCreateOpen, setCreateOpen] = useState(false)

    const { t } = useTranslation(null, { keyPrefix: "project" })

    const sortMenuItems = useMemo(() => makeSortMenuItems(t), [t])

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
        data,
        refetch: drawersRefetch,
    } = useQuery({
        queryKey: ["drawers", { projectID: id, ordering: ordering }],
        queryFn: () => getDrawersByProject(id, ordering),
    })

    /// Drawers Drag And Drop
    useEffect(() => {
        if (!data) return
        setDrawers(data)
    }, [data])

    const patchMutation = useMutation({
        mutationFn: (data) => {
            return patchReorderDrawer(data)
        },
    })

    const moveDrawer = useCallback((dragIndex, hoverIndex) => {
        setDrawers((prevDrawers) => {
            const updatedDrawers = [...prevDrawers]
            const [moved] = updatedDrawers.splice(dragIndex, 1)
            updatedDrawers.splice(hoverIndex, 0, moved)
            return updatedDrawers
        })
    }, [])

    const dropDrawer = useCallback(async () => {
        const changedDrawers = drawers
            .map((drawer, index) => ({ id: drawer.id, order: index }))
            .filter((drawer, index) => data[index]?.id !== drawer.id)

        if (changedDrawers.length === 0) return

        await patchMutation.mutateAsync(changedDrawers)

        await queryClient.refetchQueries({
            queryKey: ["drawers", { projectID: id, ordering: "order" }],
        })
        setOrdering("order")
    }, [drawers, data])
    /// ---

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
        setIsProjectEditOpen(true)
    }

    const handleAlert = () => {
        setIsAlertOpen(true)
    }

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
                    )}
                </Icons>
            </TitleBox>
            {project.type === "goal" && (
                <Progress project={project} drawers={drawers} />
            )}
            {drawers && drawers.length === 0 ? (
                <NoDrawerText>{t("no_drawer")}</NoDrawerText>
            ) : (
                <DndProvider backend={HTML5Backend}>
                    {drawers?.map((drawer) => (
                        <Drawer
                            key={drawer.id}
                            project={project}
                            drawer={drawer}
                            color={color}
                            moveDrawer={moveDrawer}
                            dropDrawer={dropDrawer}
                        />
                    ))}
                </DndProvider>
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
            {isSortMenMobileOpen && (
                <SortMenuMobile
                    title={t("sort.drawer_title")}
                    items={sortMenuItems}
                    onClose={() => setSortMenuMobileOpen(false)}
                    ordering={ordering}
                    setOrdering={setOrdering}
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
                <Suspense
                    key="task-create-project-page"
                    fallback={<ModalLoader />}>
                    <TaskCreateElement
                        onClose={() => setCreateOpen(false)}
                        project={project}
                        drawer={project.drawers[0]}
                        color={color}
                    />
                </Suspense>
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

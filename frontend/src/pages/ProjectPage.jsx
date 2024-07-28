import { useNavigate, Outlet, useParams } from "react-router-dom"
import { useState, useEffect } from "react"

import styled, { useTheme } from "styled-components"
import FeatherIcon from "feather-icons-react"

import PageTitle from "@components/common/PageTitle"
import Drawer from "@components/drawers/Drawer"
import DrawerCreate from "@components/project/Creates/DrawerCreate"
import ContextMenu from "@components/common/ContextMenu"
import DeleteAlert from "@components/common/DeleteAlert"
import ModalPortal from "@components/common/ModalPortal"
import queryClient from "@queries/queryClient"
import handleToggleContextMenu from "@utils/handleToggleContextMenu"
import SortIcon from "@components/project/sorts/SortIcon"
import SortMenu from "@components/project/sorts/SortMenu"

import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getProject, patchProject, deleteProject } from "@api/projects.api"
import { getDrawersByProject } from "@api/drawers.api"

const ProjectPage = () => {
    const { id } = useParams()
    const theme = useTheme()
    const navigate = useNavigate()

    const [isDrawerCreateOpen, setIsDrawerCreateOpen] = useState(false)
    const [ordering, setOrdering] = useState("created_at")
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
    const [selectedSortMenuPosition, setSelectedSortMenuPosition] = useState({top: 0, left: 0})
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [selectedButtonPosition, setSelectedButtonPosition] = useState({top: 0, left: 0})

    const { t } = useTranslation(null, {keyPrefix: "project"})
    
    const { isLoading: isProjectLoading, isError: isProjectError, data: project } = useQuery({
        queryKey: ['projects', id],
        queryFn: () => getProject(id),
    })

    const { isLoading: isDrawersLoading, isError: isDrawersError, data: drawers } = useQuery({
        queryKey: ['drawers', {projectID: id, ordering: ordering}],
        queryFn: () => getDrawersByProject(id, ordering),
    })

    useEffect(() => {
        setIsContextMenuOpen(false)
        setIsSortMenuOpen(false)
    }, [project])

    const patchMutation = useMutation({
        mutationFn: (data) => {
            return patchProject(id, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['projects']})
        },
    }) // 수정 만드셈

    const deleteMutation = useMutation({
        mutationFn: () => {
            return deleteProject(id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['projects']})
        },
    })

    const handleAlert = () => {
        return async () => {
            setIsContextMenuOpen(false)
            setIsAlertOpen(true)
        }
    }

    const contextMenuItems = makeContextMenuItems(theme, handleAlert)

    const handleDelete = () => {
        navigate(`/app/projects`)
        deleteMutation.mutate()
        toast.success(`"${project.name}" 프로젝트가 삭제되었습니다`)
    }

    if (isProjectLoading) {
        return <div>로딩중...</div>
        // 민영아.. 스켈레톤 뭐시기 만들어..
    }

    if (isDrawersLoading) {
        return <div>로딩중...</div>
    }

    return (
    <>
        <TitleBox>
            <PageTitle $color={"#" + project.color}>{project.name}</PageTitle>
            <Icons>
                <FeatherIcon icon="plus" onClick={() => {setIsDrawerCreateOpen(true)}}/>
                <SortIconBox onClick={handleToggleContextMenu(setSelectedSortMenuPosition, setIsSortMenuOpen, setIsContextMenuOpen)}>
                    <SortIcon color={theme.textColor}/>
                </SortIconBox>
                <FeatherIcon icon="more-horizontal" onClick={handleToggleContextMenu(setSelectedButtonPosition, setIsContextMenuOpen, setIsSortMenuOpen)}/>
            </Icons>
        </TitleBox>
        {drawers && (drawers.length === 0) ? <NoDrawerText>{t("no_drawer")}</NoDrawerText> 
        : drawers?.map((drawer) => (
            <Drawer key={drawer.id} project={project} drawer={drawer} color={project.color}/>
        ))}
        {isSortMenuOpen &&
            <SortMenu
                items={sortMenuItems}
                selectedButtonPosition={selectedSortMenuPosition}
                ordering={ordering}
                setOrdering={setOrdering}
            />
        }
        {isContextMenuOpen &&
            <ContextMenu
                items={contextMenuItems}
                selectedButtonPosition={selectedButtonPosition}
            />
        }
        {isAlertOpen &&
            <ModalPortal closeModal={() => {setIsAlertOpen(false)}}>
                <DeleteAlert title={`"${project.name}" 프로젝트를`} onClose={() => {setIsAlertOpen(false)}} func={handleDelete}/>
            </ModalPortal>
        }
        {isDrawerCreateOpen &&
            <ModalPortal closeModal={() => {setIsDrawerCreateOpen(false)}}>
                <DrawerCreate onClose={() => {setIsDrawerCreateOpen(false)}}/>
            </ModalPortal>
        }
        <Outlet context={[id, project.color]} />
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

const sortMenuItems = [
    {"display": "제목 가나다순", "context": "name"},
    {"display": "만든 지 최신순", "context": "created_at"},
    {"display": "만든 지 오래된 순", "context": "-created_at"},
    {"display": "미완료한 일↑", "context": "-uncompleted_task_count"},
    {"display": "완료한 일↑", "context": "-completed_task_count"},
    {"display": "완료한 일↓", "context": "completed_task_count"},
]

const makeContextMenuItems = (theme, handleAlert) => [
    {"icon": "edit", "display": "수정", "color": theme.textColor, "func": () => {}},
    {"icon": "trash-2", "display": "삭제", "color": theme.project.danger, "func": handleAlert()}
]

export default ProjectPage
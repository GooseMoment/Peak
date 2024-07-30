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

import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getProject, patchProject, deleteProject } from "@api/projects.api"

const ProjectPage = () => {
    const { id } = useParams()
    const theme = useTheme()
    const navigate = useNavigate()

    const [isDrawerCreateOpen, setIsDrawerCreateOpen] = useState(false)
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const [selectedButtonPosition, setSelectedButtonPosition] = useState({top: 0, left: 0})

    const { t } = useTranslation(null, {keyPrefix: "project"})
    
    const { isPending, isError, data: project, error } = useQuery({
        queryKey: ['projects', id],
        queryFn: () => getProject(id),
    })

    useEffect(() => {
        setIsContextMenuOpen(false)
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

    const handleDelete = () => {
        navigate(`/app/projects`)
        deleteMutation.mutate()
        toast.success(`"${project.name}" 프로젝트가 삭제되었습니다`)
    }

    const openInboxTaskCreate = () => {
        navigate(`/app/projects/${project.id}/tasks/create/`,
        {state: {project_name : project.name, drawer_id : project.drawers[0].id, drawer_name : project.drawers[0].name}})
    }

    if (isPending) {
        return <div>로딩중...</div>
        // 민영아.. 스켈레톤 뭐시기 만들어..
    }

    const drawers = project.drawers

    return (
    <>
        <TitleBox>
            <PageTitle $color={"#" + project.color}>{project.name}</PageTitle>
            <Icons>
                <FeatherIcon icon="plus" onClick={project.type === 'inbox' ? openInboxTaskCreate : () => {setIsDrawerCreateOpen(true)}}/>
                <FeatherIcon icon="more-horizontal" onClick={handleToggleContextMenu(setSelectedButtonPosition, setIsContextMenuOpen)}/>
            </Icons>
        </TitleBox>
        {drawers && (drawers.length === 0) ? <NoDrawerText>{t("no_drawer")}</NoDrawerText> 
        : drawers.map((drawer) => (
            <Drawer key={drawer.id} project={project} drawer={drawer} color={project.color}/>
        ))}
        {isContextMenuOpen &&
            <ContextMenu
                items={[{"icon": "trash-2", "display": "Delete", "color": theme.project.danger, "func": handleAlert()}]}
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

const NoDrawerText = styled.div`
    margin-top: 2em;
    font-weight: 600;
    font-size: 1.4em;
`

export default ProjectPage
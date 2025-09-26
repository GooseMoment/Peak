import { useRef } from "react"
import { useNavigate } from "react-router-dom"

import styled from "styled-components"

import ProjectNameBox, {
    NameBox,
    NameText,
    TypeText,
} from "@components/project/ProjectNameBox"

import { type Project } from "@api/projects.api"

import { usePaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"
import { useDrag, useDrop } from "react-dnd"
import { useTranslation } from "react-i18next"

const ProjectName = ({
    project,
    moveProject,
    dropProject,
    isPending,
}: {
    project: Project
    moveProject: (dragIndex: number, hoverIndex: number) => void
    dropProject: () => void
    isPending: boolean
}) => {
    const { t } = useTranslation("translation", { keyPrefix: "project_list" })
    const color = usePaletteColor(project.color)

    const ref = useRef<HTMLDivElement>(null)
    const isInbox = project.type === "inbox"
    const navigate = useNavigate()

    const projectLink =
        project.type === "inbox"
            ? "/app/projects/inbox"
            : `/app/projects/${project.id}`

    const name = project.type === "inbox" ? t("inbox") : project.name

    const [{ handlerId }, drop] = useDrop({
        accept: "Project",
        canDrop: (item: Project) =>
            !isPending && !isInbox && item.order !== project.order,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover: (item, monitor) => {
            if (isInbox) return
            if (!ref.current) return

            const dragOrder = item.order
            const hoverOrder = project.order

            if (dragOrder === hoverOrder) return

            const hoverBoundingRect = ref.current.getBoundingClientRect()
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()

            if (!clientOffset) return
            const hoverClientY = clientOffset.y - hoverBoundingRect.top

            if (dragOrder < hoverOrder && hoverClientY < hoverMiddleY) return
            if (dragOrder > hoverOrder && hoverClientY > hoverMiddleY) return

            if (item.order !== hoverOrder) {
                item.order = hoverOrder
                moveProject(dragOrder, hoverOrder)
            }
        },
        drop: (item) => {
            if (isPending || isInbox) return
            item.order = project.order
            dropProject()
        },
    })

    const [{ isDragging }, drag] = useDrag({
        type: "Project",
        canDrag: !isInbox,
        item: () => {
            return { id: project.id, order: project.order }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    if (!isInbox) drag(drop(ref))

    return (
        <ProjectNameBox
            ref={ref}
            data-handler-id={handlerId}
            $isDragging={isDragging}
            $isInbox={isInbox}>
            <NameBox>
                <FeatherIcon icon="circle" fill={color} />
                <div onClick={() => navigate(projectLink)} role="link">
                    <NameText>{name}</NameText>
                </div>
                <TypeText>
                    {project.type === "regular" && t("type_regular")}
                    {project.type === "goal" && t("type_goal")}
                </TypeText>
            </NameBox>

            <TaskCountBox>
                <CircleIcon>
                    <FeatherIcon icon="check" />
                </CircleIcon>
                <TaskCountText>{project.completed_task_count}</TaskCountText>
                <CircleIcon />
                <TaskCountText>{project.uncompleted_task_count}</TaskCountText>
            </TaskCountBox>
        </ProjectNameBox>
    )
}

const TaskCountBox = styled.div`
    display: flex;
    align-items: center;
    margin: 1em 0em;

    & svg {
        width: 1.5em;
        height: 1.5em;
        stroke: none;
        top: 0;
    }
`

const TaskCountText = styled.div`
    color: ${(p) => p.theme.textColor};
`

const CircleIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1em;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 2px solid ${(p) => p.theme.secondTextColor};
    margin: 0 0.3em 0 1em;

    & svg {
        top: 0;
        width: 0.8em;
        height: 0.8em;
        stroke: ${(p) => p.theme.secondTextColor};
        stroke-width: 0.2em;
        margin: 0.1rem 0 0;
    }
`

export default ProjectName

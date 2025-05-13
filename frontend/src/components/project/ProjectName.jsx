import { useRef } from "react"
import { useNavigate } from "react-router-dom"

import styled, { useTheme } from "styled-components"

import ProjectNameBox, {
    NameBox,
    NameText,
    TypeText,
} from "@components/project/ProjectNameBox"

import { getPaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"
import { useDrag, useDrop } from "react-dnd"
import { useTranslation } from "react-i18next"

const ProjectName = ({ project, index, moveProject, dropProject }) => {
    const { t } = useTranslation(null, { keyPrefix: "project_list" })
    const theme = useTheme()

    const ref = useRef(null)
    const isInbox = project.type === "inbox"
    const navigate = useNavigate()

    const [{ handlerId }, drop] = useDrop({
        accept: "Project",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover: (item, monitor) => {
            if (!ref.current) return

            const dragIndex = item.index
            const hoverIndex = index

            if (dragIndex === hoverIndex) return

            const hoverBoundingRect = ref.current.getBoundingClientRect()
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()
            const hoverClientY = clientOffset.y - hoverBoundingRect.top

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

            moveProject(dragIndex, hoverIndex)

            item.index = hoverIndex
        },
        drop: (item) => {
            dropProject()
            item.index = index
        },
    })

    const [{ isDragging }, drag] = useDrag({
        type: "Project",
        item: () => {
            return { project, index }
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
                <FeatherIcon
                    icon="circle"
                    fill={getPaletteColor(theme.type, project.color)}
                />
                <div
                    onClick={() => navigate(`/app/projects/${project.id}`)}
                    role="link">
                    <NameText>{project.name}</NameText>
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

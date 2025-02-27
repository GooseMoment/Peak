import { useRef } from "react"
import { Link } from "react-router-dom"

import styled, { useTheme } from "styled-components"

import { ifMobile } from "@utils/useScreenType"

import { getPaletteColor } from "@assets/palettes"

import FeatherIcon from "feather-icons-react"
import { useDrag, useDrop } from "react-dnd"
import { useTranslation } from "react-i18next"

const ProjectName = ({
    project,
    demo = false,
    index = null,
    moveProject = null,
    dropProject = null,
}) => {
    const { t } = useTranslation(null, { keyPrefix: "project_list" })
    const theme = useTheme()

    if (demo) {
        return (
            <Box>
                <FlexBox>
                    <FeatherIcon
                        icon="circle"
                        fill={getPaletteColor(theme.type, project.color)}
                    />
                    <NameText>{project.name}</NameText>
                    <TypeText>
                        {project.type === "regular" && t("type_regular")}
                        {project.type === "goal" && t("type_goal")}
                    </TypeText>
                </FlexBox>
            </Box>
        )
    }

    const ref = useRef(null)
    const isInbox = project.type === "inbox"

    const [{ handlerId }, drop] = useDrop({
        accept: "Project",
        canDrop: () => !isInbox,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover: (item, monitor) => {
            if (isInbox || !ref.current) return

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
            if (isInbox) return
            dropProject()
            item.index = index
        },
    })

    const [{ isDragging }, drag] = useDrag({
        type: "Project",
        canDrag: () => !isInbox,
        item: () => {
            return { project, index }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    if (!isInbox) drag(drop(ref))
    drag(drop(ref))

    let nameParts = (
        <Link to={`/app/projects/${project.id}`} draggable="false">
            <NameText>{project.name}</NameText>
        </Link>
    )

    return (
        <Box
            ref={ref}
            data-handler-id={handlerId}
            $isDragging={isDragging}
            $isInbox={isInbox}>
            <FlexBox>
                <FeatherIcon
                    icon="circle"
                    fill={getPaletteColor(theme.type, project.color)}
                />
                {nameParts}
                <TypeText>
                    {project.type === "regular" && t("type_regular")}
                    {project.type === "goal" && t("type_goal")}
                </TypeText>
            </FlexBox>
            <TaskCountBox>
                <CircleIcon>
                    <FeatherIcon icon="check" />
                </CircleIcon>
                <TaskCountText>{project.completed_task_count}</TaskCountText>
                <CircleIcon />
                <TaskCountText>{project.uncompleted_task_count}</TaskCountText>
            </TaskCountBox>
        </Box>
    )
}

const Box = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.8em 0em;
    opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
    cursor: ${(props) => (props.$isInbox ? "not-allowed" : "grab")};

    ${ifMobile} {
        flex-direction: column;
        align-items: flex-start;
    }
`

const FlexBox = styled.div`
    display: flex;
    align-items: center;

    & svg {
        width: 1.5em;
        height: 1.5em;
        stroke: none;
        top: 0;
    }
`

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

const NameText = styled.div`
    max-width: 10em;
    font-weight: normal;
    font-size: 1.25em;
    margin-left: 0.1em;
    color: ${(p) => p.theme.textColor};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3em;
    user-select: none;

    &:hover {
        color: #ff4a03;
        cursor: pointer;
    }
`

const TypeText = styled.div`
    font-weight: normal;
    font-size: 1em;
    margin-left: 0.6em;
    margin-top: 0.1em;
    color: ${(p) => p.theme.secondTextColor};
`

const TaskCountText = styled.div`
    font-size: 1em;
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
    margin-left: 1em;
    margin-right: 0.3em;

    & svg {
        width: 0.8em;
        height: 0.8em;
        stroke: ${(p) => p.theme.secondTextColor};
        stroke-width: 0.2em;
        top: 0;
        margin-top: 0.1rem;
        margin-right: 0;
    }
`

export default ProjectName

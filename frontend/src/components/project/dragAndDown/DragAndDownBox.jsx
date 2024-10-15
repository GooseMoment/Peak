import { useEffect, useRef, useState } from "react"

import styled, { css } from "styled-components"

import useScreenType from "@utils/useScreenType"

import { attachClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge"
import { DragHandleButton } from "@atlaskit/pragmatic-drag-and-drop-react-accessibility/drag-handle-button"
import {
    draggable,
    dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"

const DragAndDownBox = ({ task, color, children }) => {
    const { isDesktop } = useScreenType()

    const dragHandleRef = useRef(null)

    const [isDragging, setIsDragging] = useState(false)
    const [closestEdge, setClosestEdge] = useState(null)

    useEffect(() => {
        const element = dragHandleRef.current

        const canDrop = ({ source }) => {
            return source.data.id !== task.id
        }

        const getData = ({ input }) => {
            return attachClosestEdge(
                { order: task.order, id: task.id },
                {
                    element,
                    input,
                    allowedEdges: ["top", "bottom"],
                },
            )
        }

        const onDrag = ({ location, source }) => {
            const isSource = source.element === element

            if (isSource) {
                setClosestEdge(null)
                return
            }

            const sourceOrder = source.data.order
            if (typeof sourceOrder !== "number") return

            const targetData = location.current.dropTargets[0]?.data

            if (targetData) {
                const symbolProperties =
                    Object.getOwnPropertySymbols(targetData)
                const closestEdge = targetData[symbolProperties[0]]
                setClosestEdge(closestEdge)
            }
        }

        const removeClosestEdge = () => {
            setClosestEdge(null)
        }

        const cleanupDraggable = draggable({
            element: element,
            getInitialData: () => ({ order: task.order, id: task.id }),
            onDragStart() {
                setIsDragging(true)
            },
            onDrop() {
                setIsDragging(false)
            },
        })

        const cleanupDropTarget = dropTargetForElements({
            element,
            canDrop: canDrop,
            getData: getData,
            onDrag: onDrag,
            onDragLeave: removeClosestEdge,
            onDrop: removeClosestEdge,
        })

        return () => {
            cleanupDraggable()
            cleanupDropTarget()
        }
    }, [task.order, task.id])

    return (
        <DragAndDownBlock
            ref={dragHandleRef}
            $edge={closestEdge}
            $color={color}>
            {isDesktop && <DragHandleButtonBox>
                <DragHandleButton />
            </DragHandleButtonBox>}
            <ChildrenBox $isDragging={isDragging}>{children}</ChildrenBox>
        </DragAndDownBlock>
    )
}

const DragHandleButtonBox = styled.div`
    visibility: hidden;
    margin-bottom: 0.26em;
    margin-right: 0.2em;

    & button {
        background-color: ${(p) => p.theme.backgroundColor};
    }

    & span {
        color: ${(p) => p.theme.textColor};
    }
`

const ChildrenBox = styled.div`
    opacity: ${(props) => (props.$isDragging ? 0.5 : 1)};
`

const DragAndDownBlock = styled.div`
    display: flex;
    align-items: center;
    border-top: 2px solid transparent;
    border-bottom: 2px solid transparent;

    ${(props) =>
        props.$edge && props.$edge === "top"
            ? css`
                  border-top: 2px dashed ${(p) => p.$color};
              `
            : props.$edge === "bottom" &&
              css`
                  border-bottom: 2px dashed ${(p) => p.$color};
              `}

    &:hover {
        ${DragHandleButtonBox} {
            visibility: visible;
        }
    }

    & * {
        user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
    }
`

export default DragAndDownBox
